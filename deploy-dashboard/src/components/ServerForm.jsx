import { useState } from 'react'

const DEFAULTS = {
  name: '', host: '', port: '22', username: '',
  password: '', privateKey: '', deployCommand: '',
}

export default function ServerForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || DEFAULTS)
  const [authMode, setAuthMode] = useState('password')

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = { ...form, port: Number(form.port) || 22 }
    if (authMode === 'password') data.privateKey = null
    else data.password = null
    onSave(data)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Display Name" value={form.name} onChange={set('name')} required />
        <Field label="Host / IP" value={form.host} onChange={set('host')} required />
        <Field label="Port" value={form.port} onChange={set('port')} type="number" />
        <Field label="Username" value={form.username} onChange={set('username')} required />
      </div>

      <div className="flex gap-4 text-sm">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" checked={authMode === 'password'} onChange={() => setAuthMode('password')} />
          Password
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" checked={authMode === 'key'} onChange={() => setAuthMode('key')} />
          Private Key
        </label>
      </div>

      {authMode === 'password' ? (
        <Field label="Password" value={form.password} onChange={set('password')} type="password" />
      ) : (
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Private Key (PEM)</label>
          <textarea
            value={form.privateKey}
            onChange={set('privateKey')}
            rows={5}
            placeholder="-----BEGIN RSA PRIVATE KEY-----"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      <Field
        label="Deploy Command"
        value={form.deployCommand}
        onChange={set('deployCommand')}
        placeholder="cd /app && git pull && pm2 restart all"
      />

      <div className="flex gap-2 justify-end">
        {onCancel && (
          <button type="button" onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
            Cancel
          </button>
        )}
        <button type="submit"
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition">
          {initial ? 'Update Server' : 'Add Server'}
        </button>
      </div>
    </form>
  )
}

function Field({ label, value, onChange, type = 'text', required, placeholder }) {
  return (
    <div>
      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  )
}
