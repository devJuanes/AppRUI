export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() || 'https://iur.logsfm.com'

export const ruiEndpoint = `${API_BASE_URL}/api/rui`
export const consultasEndpoint = `${API_BASE_URL}/api/consultas`
