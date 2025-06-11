import { jwtDecode } from "jwt-decode"
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../../constants"
import axios from "axios"

export const clearSession = () => {
    localStorage.removeItem(ACCESS_TOKEN)
    localStorage.removeItem(REFRESH_TOKEN)
    sessionStorage.removeItem(ACCESS_TOKEN)
    sessionStorage.removeItem(REFRESH_TOKEN)
}

export const refreshToken = async () => {
    const refresh = localStorage.getItem(REFRESH_TOKEN) || sessionStorage.getItem(REFRESH_TOKEN)
    if (!refresh) {
        clearSession()
        return null
    }

    try {
        const res = await axios.post(`${import.meta.env.VITE_BACK_URL}/api/token/refresh/`, { refresh })
        if (res.status === 200) {
            const storage = localStorage.getItem(REFRESH_TOKEN) ? localStorage : sessionStorage
            storage.setItem(ACCESS_TOKEN, res.data.access)
            return res.data.access
        }
    } catch (err) {
        console.error("Token refresh failed:", err)
    }

    clearSession()
    return null
}

export const checkAuth = async () => {
    let token = localStorage.getItem(ACCESS_TOKEN) || sessionStorage.getItem(ACCESS_TOKEN)
    if (!token) return false

    try {
        const decoded = jwtDecode(token)
        const now = Date.now() / 1000
        if (decoded.exp < now) {
            token = await refreshToken()
            return token !== null
        }
        return true
    } catch (err) {
        console.error("Invalid access token:", err)
        clearSession()
        return false
    }
}
