import { useState, useRef, useEffect } from 'react'

const SUGGESTIONS = [
  { username: 'tubakhxn',     label: 'Tuba Khan',        sub: 'tubakhxn' },
  { username: 'torvalds',     label: 'Linus Torvalds',   sub: 'torvalds' },
  { username: 'gaearon',      label: 'Dan Abramov',      sub: 'gaearon' },
  { username: 'yyx990803',    label: 'Evan You',         sub: 'yyx990803' },
  { username: 'sindresorhus', label: 'Sindre Sorhus',    sub: 'sindresorhus' },
]

export default function SearchBar({ onSearch, loading }) {
  const [input, setInput] = useState('')
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const filtered = input.trim()
    ? SUGGESTIONS.filter(
        (s) =>
          s.label.toLowerCase().includes(input.toLowerCase()) ||
          s.username.toLowerCase().includes(input.toLowerCase())
      )
    : SUGGESTIONS

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim()) {
      setOpen(false)
      onSearch(input.trim())
    }
  }

  const handleSuggestion = (username) => {
    setInput(username)
    setOpen(false)
    onSearch(username)
  }

  return (
    <div className="w-full max-w-lg mx-auto relative" ref={wrapperRef}>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
          </span>
          <input
            type="text"
            value={input}
            onChange={(e) => { setInput(e.target.value); setOpen(true) }}
            onFocus={() => setOpen(true)}
            placeholder="Enter GitHub username..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg font-medium transition"
        >
          {loading ? 'Loading...' : 'Search'}
        </button>
      </form>

      {open && filtered.length > 0 && (
        <div className="absolute top-full left-0 right-12 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden">
          {filtered.map(({ username, label, sub }) => (
            <button
              key={username}
              onMouseDown={() => handleSuggestion(username)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition text-left"
            >
              <span className="text-gray-400 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                </svg>
              </span>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{label}</span>
                <span className="text-xs text-gray-400 truncate">@{sub}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
