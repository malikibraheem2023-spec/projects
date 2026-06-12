import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import { getServers, addServer, updateServer } from './api/servers'
import ServerCard from './components/ServerCard'
import ServerForm from './components/ServerForm'
import LogConsole from './components/LogConsole'

const socket = io()

export default function App() {
  const [servers, setServers] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingServer, setEditingServer] = useState(null)
  const [logs, setLogs] = useState([])
  const [logTitle, setLogTitle] = useState('')
  const [showLogs, setShowLogs] = useState(false)

  useEffect(() => {
    getServers().then(setServers).catch(console.error)

    socket.on('log', (line) => {
      setLogs((prev) => [...prev, line])
    })
    socket.on('done', () => {})
    return () => {
      socket.off('log')
      socket.off('done')
    }
  }, [])

  const handleAddServer = async (data) => {
    const saved = await addServer(data)
    setServers((s) => [...s, saved])
    setShowForm(false)
  }

  const handleUpdateServer = async (data) => {
    const updated = await updateServer(editingServer.id, data)
    setServers((s) => s.map((srv) => (srv.id === updated.id ? updated : srv)))
    setEditingServer(null)
  }

  const handleDeploy = (serverId, onDone) => {
    setLogs([])
    setLogTitle('Deploy Output')
    setShowLogs(true)
    socket.emit('deploy', { serverId })
    socket.once('done', onDone)
  }

  const handleStreamLogs = (serverId) => {
    setLogs([])
    setLogTitle('Server Logs')
    setShowLogs(true)
    socket.emit('stream_logs', { serverId })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Deploy Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Manage servers, stream logs, and deploy over SSH
            </p>
          </div>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition"
          >
            {showForm ? '✕ Cancel' : '+ Add Server'}
          </button>
        </div>

        {showForm && (
          <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">New Server</h2>
            <ServerForm onSave={handleAddServer} onCancel={() => setShowForm(false)} />
          </div>
        )}

        {editingServer && (
          <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Edit Server</h2>
            <ServerForm
              initial={editingServer}
              onSave={handleUpdateServer}
              onCancel={() => setEditingServer(null)}
            />
          </div>
        )}

        {servers.length === 0 ? (
          <div className="text-center py-24 text-gray-400 dark:text-gray-600">
            <div className="text-5xl mb-4">🖥️</div>
            <p>No servers yet. Add one to get started.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {servers.map((srv) => (
              <ServerCard
                key={srv.id}
                server={srv}
                onDeploy={handleDeploy}
                onEdit={setEditingServer}
                onDeleted={(id) => setServers((s) => s.filter((x) => x.id !== id))}
                onStreamLogs={handleStreamLogs}
              />
            ))}
          </div>
        )}
      </div>

      {showLogs && (
        <LogConsole
          logs={logs}
          title={logTitle}
          onClose={() => setShowLogs(false)}
        />
      )}
    </div>
  )
}
