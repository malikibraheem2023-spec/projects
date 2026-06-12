import { useState, useEffect } from 'react'
import { getStatus, deleteServer } from '../api/servers'

const STATUS_COLORS = {
  online: 'bg-green-500',
  offline: 'bg-red-500',
  checking: 'bg-yellow-400 animate-pulse',
}

export default function ServerCard({ server, onDeploy, onEdit, onDeleted, onStreamLogs }) {
  const [status, setStatus] = useState('checking')
  const [deploying, setDeploying] = useState(false)

  useEffect(() => {
    checkStatus()
  }, [server.id])

  const checkStatus = () => {
    setStatus('checking')
    getStatus(server.id)
      .then((d) => setStatus(d.status))
      .catch(() => setStatus('offline'))
  }

  const handleDeploy = () => {
    setDeploying(true)
    onDeploy(server.id, () => setDeploying(false))
  }

  const handleDelete = async () => {
    if (!confirm(`Delete server "${server.name}"?`)) return
    await deleteServer(server.id)
    onDeleted(server.id)
  }

  return (
    <div className="p-5 bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-100 dark:border-gray-700">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">{server.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{server.username}@{server.host}:{server.port}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${STATUS_COLORS[status]}`} title={status} />
          <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">{status}</span>
        </div>
      </div>

      {server.deployCommand && (
        <code className="block text-xs bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 rounded px-2 py-1 mb-3 truncate">
          {server.deployCommand}
        </code>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleDeploy}
          disabled={deploying}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs rounded-lg font-medium transition"
        >
          {deploying ? '⏳ Deploying...' : '🚀 Deploy'}
        </button>
        <button
          onClick={() => onStreamLogs(server.id)}
          className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded-lg font-medium transition"
        >
          📋 Logs
        </button>
        <button
          onClick={checkStatus}
          className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-xs rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
        >
          ↺ Ping
        </button>
        <button
          onClick={() => onEdit(server)}
          className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-xs rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
        >
          ✏️ Edit
        </button>
        <button
          onClick={handleDelete}
          className="px-3 py-1.5 text-red-600 border border-red-200 dark:border-red-800 text-xs rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition"
        >
          🗑
        </button>
      </div>
    </div>
  )
}
