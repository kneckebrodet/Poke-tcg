import { Link } from "react-router-dom"

function Navbar() {
    return (
        <nav className="block w-[98vw] px-4 py-2 mx-auto text-white bg-white shadow-md rounded-md lg:px-8 lg:py-3">
            <div className="container flex flex-wrap items-center justify-between mx-auto text-slate-800">
                <a href="#"
                    className="mr-4 block cursor-pointer py-1.5 text-base text-slate-800 font-semibold">
                </a>
                <div className="hidden lg:block">
                    <ul className="flex flex-col gap-2 mt-2 mb-4 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6 pr-[3vw]">
                        <li
                            className="flex items-center p-1 text-sm gap-x-2 text-slate-600">
                                <Link to={"/"} className="flex items-center">
                                    Pokedex
                                </Link>
                        </li>

                        <li
                            className="flex items-center p-1 text-sm gap-x-2 text-slate-600">
                            <Link to={"/login"} className="flex items-center">
                                Sign in
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>)
}

export default Navbar