import { useEffect, useState } from 'react'
import PokemonCard from '../components/PokemonCard'
import PokemonFilter from '../components/PokemonFilter'
import Paginator from '../components/Paginator'
import Modal from '../components/Modal'


function PokedexPage() {
    const [pokemons, setPokemons] = useState([])
    const [page, setPage] = useState(1)
    const [count, setCount] = useState(0)
    const [filters, setFilters] = useState({})
    const [selectedCards, setSelectedCards] = useState([])
    const [showModal, setShowModal] = useState(false)
    const pageSize = 24

    useEffect(() => {
        const fetchPokemons = async () => {
            try {
                const queryParams = new URLSearchParams({
                    page,
                    page_size: pageSize,
                    ...filters,
                })

                const res = await fetch(`http://localhost:8000/api/pokemon/?${queryParams}`)
                const data = await res.json()
                setPokemons(data.results)
                setCount(data.count)
            } catch (err) {
                console.error('Failed to fetch pokemons:', err)
            }
        }

        fetchPokemons()
    }, [page, filters])

    const totalPages = Math.ceil(count / pageSize)

    const handleClickOnCard = (pokemon) => {
        setSelectedCards([...selectedCards, pokemon])
        setShowModal(true)
        console.log(selectedCards)
    }

    return (
        <div className="flex flex-col items-center text-center font-sans">
            <h1 className="mt-0 text-2x1 font-bold">Pokedex</h1>

            <PokemonFilter onFilterChange={(newFilters) => {
                setPage(1)
                setFilters(newFilters)
            }} />

            <Paginator
                page={page}
                totalPages={totalPages}
                onPageChange={setPage} />

            <div className="grid gap-2 grid-cols-4 grid-rows-6 mb-[4vh]">
                {pokemons.map(pokemon => (
                    <PokemonCard
                        key={pokemon.id}
                        pokemon={pokemon}
                        onClick={() => handleClickOnCard(pokemon)} />
                ))}
            </div>
            
            {count > 4 && <Paginator
                page={page}
                totalPages={totalPages}
                onPageChange={setPage} />
            }

            {showModal && <Modal />}
            </div>
    )
}

export default PokedexPage
