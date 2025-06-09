import { useState } from 'react'
import Modal from '../components/PokedexComponents/Modal'
import PokemonCardGrid from '../components/PokedexComponents/PokemonCardGrid'
import Navbar from "../components/Navbar"


function PokedexPage() {
    const [selectedPokemon, setSelectedPokemon] = useState({})
    const [showModal, setShowModal] = useState(false)

    const handleClickOnCard = (pokemon) => {
        setSelectedPokemon(pokemon)
        setShowModal(true)
    }

    const handleHideModal = () => {
        setShowModal(false)
    }

    return (
        <>
        <Navbar />
        <div className="flex flex-col mt-[3vh]">
            <PokemonCardGrid handleClickOnCard={handleClickOnCard}/>

            {showModal && <Modal pokemon={selectedPokemon} hideModal={handleHideModal} />}
        </div>
        </>
    )
}

export default PokedexPage
