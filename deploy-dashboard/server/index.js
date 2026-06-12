const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')
const fs = require('fs')
const path = require('path')
const { v4: uuidv4 } = require('uuid')
const { Client } = require('ssh2')

const app = express()
const server = http.createServer(app)
const io = new Server(server, { cors: { origin: '*' } })

app.use(cors())
app.use(express.json())

const SERVERS_FILE = path.join(__dirname, 'servers.json')

const loadServers = () => {
  if (!fs.existsSync(SERVERS_FILE)) return []
  return JSON.parse(fs.readFileSync(SERVERS_FILE, 'utf8'))
}

const saveServers = (servers) => {
  fs.writeFileSync(SERVERS_FILE, JSON.stringify(servers, null, 2))
}

// List servers
app.get('/api/servers', (req, res) => {
  res.json(loadServers().map(({ password, privateKey, ...s }) => s))
})

// Add server
app.post('/api/servers', (req, res) => {
  const { name, host, port, username, password, privateKey, deployCommand } = req.body
  if (!name || !host || !username) {
    return res.status(400).json({ error: 'name, host, and username are required' })
  }
  const servers = loadServers()
  const newServer = {
    id: uuidv4(),
    name,
    host,
    port: port || 22,
    username,
    password: password || null,
    privateKey: privateKey || null,
    deployCommand: deployCommand || 'echo "No deploy command set"',
  }
  servers.push(newServer)
  saveServers(servers)
  const { password: _p, privateKey: _k, ...safe } = newServer
  res.json(safe)
})

// Update server
app.put('/api/servers/:id', (req, res) => {
  const servers = loadServers()
  const idx = servers.findIndex((s) => s.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Server not found' })
  servers[idx] = { ...servers[idx], ...req.body, id: req.params.id }
  saveServers(servers)
  const { password: _p, privateKey: _k, ...safe } = servers[idx]
  res.json(safe)
})

// Delete server
app.delete('/api/servers/:id', (req, res) => {
  const servers = loadServers()
  const filtered = servers.filter((s) => s.id !== req.params.id)
  saveServers(filtered)
  res.json({ ok: true })
})

// Check status (ping SSH)
app.get('/api/servers/:id/status', async (req, res) => {
  const servers = loadServers()
  const srv = servers.find((s) => s.id === req.params.id)
  if (!srv) return res.status(404).json({ error: 'Not found' })

  const conn = new Client()
  let done = false

  const finish = (status) => {
    if (done) return
    done = true
    conn.end()
    res.json({ status })
  }

  conn.on('ready', () => finish('online'))
    .on('error', () => finish('offline'))
    .connect({
      host: srv.host,
      port: srv.port,
      username: srv.username,
      password: srv.password || undefined,
      privateKey: srv.privateKey || undefined,
      readyTimeout: 5000,
    })

  setTimeout(() => finish('offline'), 6000)
})

// WebSocket: stream logs for a deploy
io.on('connection', (socket) => {
  socket.on('deploy', ({ serverId }) => {
    const servers = loadServers()
    const srv = servers.find((s) => s.id === serverId)
    if (!srv) {
      socket.emit('log', '[error] Server not found')
      socket.emit('done', { code: 1 })
      return
    }

    socket.emit('log', `[info] Connecting to ${srv.host}...`)

    const conn = new Client()

    conn.on('ready', () => {
      socket.emit('log', '[info] SSH connected. Running deploy command...')
      conn.exec(srv.deployCommand, (err, stream) => {
        if (err) {
          socket.emit('log', `[error] ${err.message}`)
          socket.emit('done', { code: 1 })
          conn.end()
          return
        }
        stream.on('data', (data) => {
          socket.emit('log', data.toString())
        })
        stream.stderr.on('data', (data) => {
          socket.emit('log', `[stderr] ${data.toString()}`)
        })
        stream.on('close', (code) => {
          socket.emit('log', `[info] Deploy finished with exit code ${code}`)
          socket.emit('done', { code })
          conn.end()
        })
      })
    })
    .on('error', (err) => {
      socket.emit('log', `[error] SSH error: ${err.message}`)
      socket.emit('done', { code: 1 })
    })
    .connect({
      host: srv.host,
      port: srv.port,
      username: srv.username,
      password: srv.password || undefined,
      privateKey: srv.privateKey || undefined,
      readyTimeout: 10000,
    })
  })

  socket.on('stream_logs', ({ serverId, command }) => {
    const servers = loadServers()
    const srv = servers.find((s) => s.id === serverId)
    if (!srv) {
      socket.emit('log', '[error] Server not found')
      return
    }

    const conn = new Client()
    conn.on('ready', () => {
      conn.exec(command || 'journalctl -n 50 --no-pager', (err, stream) => {
        if (err) {
          socket.emit('log', `[error] ${err.message}`)
          conn.end()
          return
        }
        stream.on('data', (data) => socket.emit('log', data.toString()))
        stream.stderr.on('data', (data) => socket.emit('log', `[stderr] ${data.toString()}`))
        stream.on('close', () => conn.end())
      })
    })
    .on('error', (err) => socket.emit('log', `[error] ${err.message}`))
    .connect({
      host: srv.host,
      port: srv.port,
      username: srv.username,
      password: srv.password || undefined,
      privateKey: srv.privateKey || undefined,
      readyTimeout: 10000,
    })
  })
})

const PORT = process.env.PORT || 4000
server.listen(PORT, () => console.log(`Deploy dashboard server running on port ${PORT}`))
