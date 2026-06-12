import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

export const getServers = () => api.get('/servers').then((r) => r.data)
export const addServer = (data) => api.post('/servers', data).then((r) => r.data)
export const updateServer = (id, data) => api.put(`/servers/${id}`, data).then((r) => r.data)
export const deleteServer = (id) => api.delete(`/servers/${id}`).then((r) => r.data)
export const getStatus = (id) => api.get(`/servers/${id}/status`).then((r) => r.data)
