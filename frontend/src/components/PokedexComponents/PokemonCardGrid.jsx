import { useState, useEffect, useContext } from "react"
import PokemonFilter from "./PokemonFilter"
import PokemonCard from "./PokemonCard"
import Paginator from "./Paginator"
import api from "../../utils/api_tool"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../contexts/AuthContext"


function PokemonCardGrid({handleClickOnCard}) {
    const [pokemons, setPokemons] = useState([])
    const [page, setPage] = useState(1)
    const [count, setCount] = useState(0)
    const [filters, setFilters] = useState({})
    const pageSize = 25
    const navigate = useNavigate()
    const { logout } = useContext(AuthContext)

    useEffect(() => {
    const fetchPokemons = async () => {
        try {
            const res = await api.get("/cards/", {
                params: {
                    page,
                    page_size: pageSize,
                    ...filters,
                }
            })

            setPokemons(res.data.results)
            setCount(res.data.count)
        } catch (err) {
            console.error("Failed to fetch pokemons:", err)
            logout()
            navigate("/")
        }
    }

    fetchPokemons()
}, [page, filters])

    const totalPages = Math.ceil(count / pageSize)

    return (
        <div className="flex flex-col items-center">
            <PokemonFilter onFilterChange={(newFilters) => {
                setPage(1)
                setFilters(newFilters)
            }} />

            <Paginator
                page={page}
                totalPages={totalPages}
                onPageChange={setPage} />

            <div className="grid w-[80%] gap-4 grid-cols-5 mb-[4vh] rounded-[10px] p-[2%]">
                {pokemons.map(pokemon => (
                    <PokemonCard
                        key={pokemon.id}
                        pokemon={pokemon}
                        onClick={() => handleClickOnCard(pokemon)} 
                        className="w-[15vw]"    
                    />
                ))}
            </div>

            {count > 8 && <Paginator
                page={page}
                totalPages={totalPages}
                onPageChange={setPage} />
            }
        </div>
    )
}

export default PokemonCardGrid