import { useEffect, useState } from 'react'
import PokemonCard from '../components/PokedexComponents/PokemonCard'
import PokemonFilter from '../components/PokedexComponents/PokemonFilter'
import Paginator from '../components/PokedexComponents/Paginator'
import Modal from '../components/PokedexComponents/Modal'


function PokedexPage() {
    const [pokemons, setPokemons] = useState([])
    const [page, setPage] = useState(1)
    const [count, setCount] = useState(0)
    const [filters, setFilters] = useState({})
    const [selectedPokemon, setSelectedPokemon] = useState({})
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
        setSelectedPokemon(pokemon)
        setShowModal(true)
    }

    const handleHideModal = () => {
        setShowModal(false)
    }

    return (
        <div className="flex flex-col ml-[10vw] w-[80vw] font-sans">
            <h1 className="mt-2 mb-2 text-center text-[2em] font-bold">Pokedex</h1>

            <PokemonFilter onFilterChange={(newFilters) => {
                setPage(1)
                setFilters(newFilters)
            }} />

            <Paginator
                page={page}
                totalPages={totalPages}
                onPageChange={setPage} />

            <div className="grid gap-4 grid-cols-4 mb-[4vh]">
                {pokemons.map(pokemon => (
                    <PokemonCard
                        key={pokemon.id}
                        pokemon={pokemon}
                        onClick={() => handleClickOnCard(pokemon)} />
                ))}
            </div>

            {count > 8 && <Paginator
                page={page}
                totalPages={totalPages}
                onPageChange={setPage} />
            }

            {showModal && <Modal pokemon={selectedPokemon} hideModal={handleHideModal} />}
        </div>
    )
}

export default PokedexPage
