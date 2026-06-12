import axios from 'axios'

const BASE = 'https://api.github.com'

const headers = import.meta.env.VITE_GITHUB_TOKEN
  ? { Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}` }
  : {}

const api = axios.create({ baseURL: BASE, headers })

export const fetchUser = (username) =>
  api.get(`/users/${username}`).then((r) => r.data)

export const fetchRepos = (username) =>
  api.get(`/users/${username}/repos?per_page=100&sort=updated`).then((r) => r.data)

export const fetchEvents = (username) =>
  api.get(`/users/${username}/events/public?per_page=100`).then((r) => r.data)
