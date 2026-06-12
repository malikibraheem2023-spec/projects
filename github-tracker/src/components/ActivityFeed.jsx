const EVENT_LABELS = {
  PushEvent: '⬆️ Pushed',
  CreateEvent: '✨ Created',
  PullRequestEvent: '🔀 Pull Request',
  IssuesEvent: '🐛 Issue',
  WatchEvent: '⭐ Starred',
  ForkEvent: '🍴 Forked',
  DeleteEvent: '🗑️ Deleted',
  IssueCommentEvent: '💬 Commented',
}

export default function ActivityFeed({ events }) {
  const visible = events.slice(0, 15)

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Recent Activity</h3>
      <ul className="space-y-2">
        {visible.map((event) => (
          <li key={event.id} className="flex gap-3 items-start text-sm">
            <span className="shrink-0 text-base">{EVENT_LABELS[event.type]?.split(' ')[0] ?? '📌'}</span>
            <div>
              <span className="text-gray-700 dark:text-gray-300">
                {EVENT_LABELS[event.type]?.split(' ').slice(1).join(' ') ?? event.type}
              </span>{' '}
              <span className="text-purple-600 dark:text-purple-400 font-medium">{event.repo.name}</span>
              <div className="text-xs text-gray-400">{new Date(event.created_at).toLocaleDateString()}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
