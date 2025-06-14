// services/api.js
class ApiService {
  constructor(baseURL) {
    this.baseURL = baseURL
  }

  async get(endpoint) {
    const response = await fetch(`${this.baseURL}${endpoint}`)
    return response.json()
  }

  async patch(endpoint, data) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  }
}

export const api = new ApiService(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api')