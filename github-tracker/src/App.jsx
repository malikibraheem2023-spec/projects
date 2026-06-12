import { useState } from 'react'
import { fetchUser, fetchRepos, fetchEvents } from './api/github'
import SearchBar from './components/SearchBar'
import UserCard from './components/UserCard'
import LanguageChart from './components/LanguageChart'
import RepoList from './components/RepoList'
import ActivityFeed from './components/ActivityFeed'
import PortfolioExport from './components/PortfolioExport'

export default function App() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [user, setUser] = useState(null)
  const [repos, setRepos] = useState([])
  const [events, setEvents] = useState([])

  const handleSearch = async (username) => {
    setLoading(true)
    setError(null)
    setUser(null)
    setRepos([])
    setEvents([])
    try {
      const [u, r, e] = await Promise.all([
        fetchUser(username),
        fetchRepos(username),
        fetchEvents(username),
      ])
      setUser(u)
      setRepos(r)
      setEvents(e)
    } catch (err) {
      if (err.response?.status === 404) {
        setError('User not found.')
      } else if (err.response?.status === 403) {
        setError('GitHub API rate limit exceeded. Try again in a minute.')
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            GitHub Activity Tracker
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Search any GitHub user — visualize their activity and export a portfolio
          </p>
        </div>

        <SearchBar onSearch={handleSearch} loading={loading} />

        {error && (
          <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl text-sm text-center">
            {error}
          </div>
        )}

        {user && (
          <div className="mt-8 space-y-6">
            <UserCard user={user} />

            <div className="flex justify-end">
              <PortfolioExport user={user} repos={repos} />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <LanguageChart repos={repos} />
              </div>
              <div className="md:col-span-2">
                <ActivityFeed events={events} />
              </div>
            </div>

            <RepoList repos={repos} />
          </div>
        )}

        {!user && !loading && !error && (
          <div className="mt-16 text-center text-gray-400 dark:text-gray-600 text-sm">
            Enter a GitHub username to get started
          </div>
        )}
      </div>
    </div>
  )
}
