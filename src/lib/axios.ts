import axios from 'axios'
import { getDefaultStore } from 'jotai'
import { tokenAtom } from '@/atoms/loginAtoms'

const instance = axios.create()

// Request interceptor to add authorization header
instance.interceptors.request.use(
  (config) => {
    const store = getDefaultStore()
    const token = store.get(tokenAtom)
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status
      if (status === 401 || status === 403) {
        // Clear any stored auth data and redirect to login
        // Note: Since we're not using localStorage, we'll just redirect
        window.location.hash = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default instance
