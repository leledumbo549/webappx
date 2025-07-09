import axios from 'axios'

const instance = axios.create()

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status
      if (status === 401 || status === 403) {
        localStorage.clear()
        window.location.hash = '/auth/login'
      }
    }
    return Promise.reject(error)
  }
)

export default instance
