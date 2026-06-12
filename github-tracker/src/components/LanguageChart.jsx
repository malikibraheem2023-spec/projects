import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const COLORS = [
  '#a855f7', '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
  '#6366f1', '#14b8a6', '#f97316', '#84cc16', '#ec4899',
]

export default function LanguageChart({ repos }) {
  const counts = {}
  repos.forEach((r) => {
    if (r.language) counts[r.language] = (counts[r.language] || 0) + 1
  })

  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 8)

  if (!sorted.length) return null

  const data = {
    labels: sorted.map(([lang]) => lang),
    datasets: [
      {
        data: sorted.map(([, count]) => count),
        backgroundColor: COLORS.slice(0, sorted.length),
        borderWidth: 2,
        borderColor: 'transparent',
      },
    ],
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Languages</h3>
      <div className="w-56 mx-auto">
        <Doughnut data={data} options={{ plugins: { legend: { position: 'bottom' } } }} />
      </div>
    </div>
  )
}
