import { useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../contexts/AuthContext"

function Navbar() {
    const { isLoggedIn, logout } = useContext(AuthContext)
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate("/login")
    }

    const handleMyDeck = () => {
        if (!isLoggedIn) {
            logout()
            navigate("/login")
        } else {
            navigate("/decks")
        }
    }

    const handleLobby = () => {
        if (!isLoggedIn) {
            logout()
            navigate("/login")
        } else {
            navigate("/lobby")
        }
    }

    return (
        <div className="sticky top-0 bg-white border-b border-gray-200 shadow-md/20 text-sm">
            <div className="flex flex-wrap items-center justify-between px-[2vw] py-2">
                <Link
                    to="/"
                    className="flex items-center gap-2 text-base font-semibold text-slate-800"
                >
                    <img src="/pokedex.png" alt="Pokedex Logo" className="w-[3vw]" />
                </Link>
                <ul className="flex gap-[4vw] text-slate-600 text-sm">
                    {isLoggedIn ? (
                        <>
                            <li>
                                <button
                                    onClick={handleLobby}
                                    className="italic cursor-pointer bg-transparent border-none p-0 m-0 text-slate-600 hover:text-slate-800"
                                    type="button"
                                >
                                    Lobby
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={handleMyDeck}
                                    className="italic cursor-pointer bg-transparent border-none p-0 m-0 text-slate-600 hover:text-slate-800"
                                    type="button"
                                >
                                    My Decks
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={handleLogout}
                                    className="italic cursor-pointer bg-transparent border-none p-0 m-0 text-slate-600 hover:text-slate-800"
                                    type="button"
                                >
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <li>
                            <Link to="/login">Sign in</Link>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    )
}

export default Navbar
