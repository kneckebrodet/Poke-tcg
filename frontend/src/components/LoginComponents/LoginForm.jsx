import { useState, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../../contexts/AuthContext"
import api from "../../utils/api_tool"

function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const { login } = useContext(AuthContext)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await api.post("/api/token/", {
        username,
        password,
      })

      const data = response.data

      login(data.access, data.refresh)
      navigate("/lobby")
    } catch (err) {
      console.error("Login failed:", err)
      const detail = err.response?.data?.detail || "Login failed."
      setError(detail)
    } finally {
      setLoading(false)
    }
  }

  const handleUsernameChange = (e) => {
    setUsername(e.target.value)
    if (error) setError(null)
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
    if (error) setError(null)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center pt-[5vh] w-[30vw] h-[70vh] ml-[35vw] mt-[5vh] gap-[3vh] bg-white border-1 border-gray-300 rounded-[10px] shadow-lg/40"
      aria-label="Login form"
    >
      <h2 className="text-xl font-semibold">Sign in</h2>
      <div className="flex flex-col items-center justify-center h-[30%] w-[80%] gap-[2vh]">
        <input
          className="w-[100%] h-[35%] border-1 border-gray-300 pl-4 rounded-[20px]"
          placeholder="Username"
          aria-label="Username"
          value={username}
          onChange={handleUsernameChange}
          required
        />

        <input
          className="w-[100%] h-[35%] border-1 border-gray-300 pl-4 rounded-[20px]"
          placeholder="Password"
          type="password"
          aria-label="Password"
          value={password}
          onChange={handlePasswordChange}
          required
        />
      </div>
      <div className="flex flex-col gap-[1vh] w-[60%] h-[24%]">
        <button
          className="border-1 border-gray-300 rounded-[20px] h-[40%]"
          type="submit"
          disabled={loading}
          aria-disabled={loading}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
        <button
          className="border-1 border-gray-300 rounded-[20px] h-[40%]"
          type="button"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>
      <div className="flex gap-[2vw] text-blue-500 italic hover:text-blue-700">
        <Link to={"/register"}>Register</Link>
        <Link to={"/"}>Forgot password?</Link>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  )
}

export default LoginForm
