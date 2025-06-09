import { useState } from "react"
import { Link } from "react-router-dom"

function LoginForm() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()  // Prevent default form submit behavior

        try {
            const response = await fetch("http://localhost:8000/api/token/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            })

            const data = await response.json()

            if (response.ok) {
                console.log("Tokens:", data)
                // You could store them in localStorage or context here
                // localStorage.setItem('access', data.access)
                // localStorage.setItem('refresh', data.refresh)
            } else {
                setError(data.detail || "Login failed.")
            }
        } catch (err) {
            setError("An error occurred. Please try again.")
        }
    }


    return (
        <form onSubmit={handleSubmit} className="flex flex-col items-center pt-[5vh] w-[30vw] h-[70vh] ml-[35vw] mt-[5vh] gap-[3vh] bg-white border-1 border-gray-300 rounded-[10px] shadow-lg/40">
            <div className="">
                Sign in
            </div>
            <div className="flex flex-col items-center justify-center h-[30%] w-[80%] gap-[2vh]">
                <input
                    className="w-[100%] h-[35%] border-1 border-gray-300 pl-4 rounded-[20px]"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input
                    className="w-[100%] h-[35%] border-1 border-gray-300 pl-4 rounded-[20px]"
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <div className="flex flex-col gap-[1vh] w-[60%] h-[24%]">
                <button className="border-1 border-gray-300 rounded-[20px] h-[40%]" type="submit">
                    Sign in
                </button>
                <button className="border-1 border-gray-300 rounded-[20px] h-[40%]">
                    Back
                </button>
            </div>
            <div>
                <Link to={"/register"}>
                    Register
                </Link>
                <Link to={"/"}>
                    Forgot password?
                </Link>
            </div>
        </form>
    )

}

export default LoginForm