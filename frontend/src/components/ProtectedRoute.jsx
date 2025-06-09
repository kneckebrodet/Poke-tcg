import { useContext } from "react"
import { Navigate } from "react-router-dom"
import { AuthContext } from "../contexts/AuthContext"

function ProtectedRoute({ children }) {
  const { isLoggedIn } = useContext(AuthContext)

  if (isLoggedIn === null) return <div>Loading...</div>
  return isLoggedIn ? children : <Navigate to="/login" />
}

export default ProtectedRoute
