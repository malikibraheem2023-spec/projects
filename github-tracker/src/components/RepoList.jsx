export default function RepoList({ repos }) {
  const sorted = [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 12)

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Top Repositories</h3>
      <div className="grid sm:grid-cols-2 gap-3">
        {sorted.map((repo) => (
          <a
            key={repo.id}
            href={repo.html_url}
            target="_blank"
            rel="noreferrer"
            className="block p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-500 transition"
          >
            <div className="flex justify-between items-start mb-1">
              <span className="font-medium text-purple-600 dark:text-purple-400 text-sm truncate">
                {repo.name}
              </span>
              <span className="text-xs text-yellow-500 ml-2 shrink-0">⭐ {repo.stargazers_count}</span>
            </div>
            {repo.description && (
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{repo.description}</p>
            )}
            <div className="mt-2 flex gap-2 text-xs text-gray-400">
              {repo.language && <span className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full">{repo.language}</span>}
              <span>🍴 {repo.forks_count}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
