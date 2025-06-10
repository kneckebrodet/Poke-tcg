import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import api from "../../utils/api_tool"

function RegisterForm() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [rePassword, setRePassword] = useState("")
    const [email, setEmail] = useState("")
    const [error, setError] = useState(null)

    const navigate = useNavigate()

    useEffect(() => {
        setUsername("")
        setEmail("")
        setPassword("")
        setRePassword("")
        setError("")
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== rePassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const payload = {
                username,
                email,
                password,
                currency: 0,
                favorite: "",
                membership: "FREE"
            };

            const response = await api.post("http://localhost:8000/accounts/register/", payload);

            console.log("Successfully created new user!");
            navigate("/login");

        } catch (err) {
            // Axios error handling
            if (err.response && err.response.data) {
                const data = err.response.data;
                console.log("Error response from backend:", data);

                // Show the first error message
                const firstKey = Object.keys(data)[0];
                setError(data[firstKey][0] || "Registration failed.");
            } else {
                console.error("Unexpected error:", err);
                setError("An error occurred. Please try again.");
            }
        }
    };


    const handleBack = () => {
        navigate("/login")
    }



    return (
        <form onSubmit={handleSubmit} className="flex flex-col items-center pt-[5vh] w-[30vw] h-[70vh] ml-[35vw] mt-[5vh] gap-[3vh] bg-white border-1 border-gray-300 rounded-[10px] shadow-lg/40">
            <div className="">
                Sign in
            </div>
            <div className="flex flex-col items-center justify-center h-[30%] w-[80%] h-[60%] gap-[2vh]">
                <input
                    className="w-[100%] h-[35%] border-1 border-gray-300 pl-4 rounded-[20px]"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    className="w-[100%] h-[35%] border-1 border-gray-300 pl-4 rounded-[20px]"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    className="w-[100%] h-[35%] border-1 border-gray-300 pl-4 rounded-[20px]"
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    className="w-[100%] h-[35%] border-1 border-gray-300 pl-4 rounded-[20px]"
                    placeholder="Password"
                    type="password"
                    value={rePassword}
                    onChange={(e) => setRePassword(e.target.value)}
                />
            </div>
            <div className="text-red-500">{error}</div>
            <div className="flex flex-col gap-[1vh] w-[60%] h-[24%]">
                <button className="border-1 border-gray-300 rounded-[20px] h-[40%]" type="submit">
                    Register
                </button>
                <button className="border-1 border-gray-300 rounded-[20px] h-[30%]" onClick={handleBack}>
                    Back
                </button>
            </div>
        </form>
    )

}

export default RegisterForm