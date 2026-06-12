import { useEffect, useRef } from 'react'

export default function LogConsole({ logs, title, onClose }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  return (
    <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 p-4">
      <div className="w-full max-w-3xl bg-gray-950 rounded-2xl shadow-2xl flex flex-col max-h-[80vh]">
        <div className="flex justify-between items-center px-5 py-3 border-b border-gray-800">
          <span className="text-sm font-mono text-green-400">{title}</span>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 font-mono text-xs text-green-300 space-y-0.5">
          {logs.length === 0 ? (
            <span className="text-gray-600">Waiting for output...</span>
          ) : (
            logs.map((line, i) => (
              <div key={i} className={
                line.startsWith('[error]') ? 'text-red-400' :
                line.startsWith('[info]') ? 'text-blue-400' :
                line.startsWith('[stderr]') ? 'text-yellow-400' : 'text-green-300'
              }>
                {line}
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  )
}
