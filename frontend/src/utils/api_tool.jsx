import axios from "axios"
import { refreshToken } from "./auth"
import { ACCESS_TOKEN } from "../../constants"
import { jwtDecode } from "jwt-decode"

const baseURL = window.location.hostname === 'localhost'
  ? 'http://localhost:8000'
  : `http://${window.location.hostname}:8000`;

const api = axios.create({
    baseURL
})

api.interceptors.request.use(
    async (config) => {
        let token = localStorage.getItem(ACCESS_TOKEN) || sessionStorage.getItem(ACCESS_TOKEN)

        if (token) {
            try {
                const decoded = jwtDecode(token)
                const tokenExpirationTime = decoded.exp * 1000
                const currentTime = Date.now()

                if (tokenExpirationTime < currentTime) {
                    console.log('Token expired, trying to refresh...')
                    token = await refreshToken()
                    if (!token) {
                        console.log("Token refresh failed.")
                        return Promise.reject(new Error("Session expired. Please log in again."))
                    }
                }

                config.headers.Authorization = `Bearer ${token}`
            } catch (error) {
                console.error("Failed to decode or refresh token:", error)
                return Promise.reject(new Error("Invalid session. Please log in again."))
            }
        }

        return config
    },
    (error) => Promise.reject(error)
)

export default api
