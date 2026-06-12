export default function UserCard({ user }) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-100 dark:border-gray-700">
      <img
        src={user.avatar_url}
        alt={user.login}
        className="w-24 h-24 rounded-full border-4 border-purple-200 dark:border-purple-700"
      />
      <div className="text-left flex-1">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {user.name || user.login}
        </h2>
        <p className="text-purple-600 dark:text-purple-400 text-sm mb-1">@{user.login}</p>
        {user.bio && <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{user.bio}</p>}
        <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
          {user.location && <span>📍 {user.location}</span>}
          {user.company && <span>🏢 {user.company}</span>}
          {user.blog && (
            <a href={user.blog} target="_blank" rel="noreferrer" className="text-purple-500 hover:underline">
              🔗 {user.blog}
            </a>
          )}
        </div>
      </div>
      <div className="flex gap-6 text-center">
        <Stat label="Repos" value={user.public_repos} />
        <Stat label="Followers" value={user.followers} />
        <Stat label="Following" value={user.following} />
      </div>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div>
      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{value}</div>
      <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
    </div>
  )
}
