import { useState, useEffect, useContext } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import PokemonCardGrid from "../components/PokedexComponents/PokemonCardGrid"
import DeckCardGrid from "../components/DeckComponents/DeckCardGrid"
import api from "../utils/api_tool"
import { ACCESS_TOKEN } from "../../constants"
import { checkAuth } from "../utils/auth"
import { AuthContext } from "../contexts/AuthContext"
import Navbar from "../components/Navbar"

function CreateDeckPage() {
    const location = useLocation()
    const initialDeck = location.state?.deck || null
    const isEditMode = !!initialDeck
    const { logout } = useContext(AuthContext)

    const [deck, setDeck] = useState(initialDeck?.cards || [])
    const [deckName, setDeckName] = useState(initialDeck?.name || "")
    const navigate = useNavigate()

    useEffect(() => {
        const verifyAuth = async () => {
            const auth = await checkAuth()
            if (!auth) {
                logout()
                navigate('/login')
            }
        }
        verifyAuth()
    }, [])


    const handleClickOnCard = (pokemon) => {
        if (deck.length >= 60) {
            return
        }

        if (pokemon.basic_energy === "1") {
            setDeck([...deck, pokemon])
            return
        }

        const sameCardCount = deck.filter(p => p.card_name === pokemon.card_name).length
        if (sameCardCount >= 4) {
            return
        }

        if (pokemon.is_ace_spec === "1") {
            const aceSpecCount = deck.filter(p => p.is_ace_spec === 1 || p.is_ace_spec === "1").length
            if (aceSpecCount >= 1) {
                alert("You can only have 1 ACE SPEC card in your deck..!")
                return
            }
        }

        setDeck([...deck, pokemon])
    }

    const handleRemoveCard = (pokemonToRemove) => {
        setDeck(prevDeck => {
            const index = prevDeck.findIndex(p => p.id === pokemonToRemove.id)
            if (index === -1) return prevDeck
            const newDeck = [...prevDeck]
            newDeck.splice(index, 1)
            return newDeck
        })
        console.log(deck)
    }

    const handleCreateDeck = async () => {
        if (!deckName.trim()) {
            alert("Deck name is required.")
            return
        }

        if (!deck.some(card => card.supertype === "たね")) {
            alert("Every deck needs at least 1 basic pokemon!")
            return
        }

        const payload = {
            name: deckName,
            cards: deck.map(card => card.id),
        }

        try {
            if (isEditMode) {
                await api.delete(`/decks/delete/${initialDeck.id}/`)
            }
            
            await api.post("/decks/create/", payload)

            setDeck([])
            setDeckName("")
            navigate("/decks") //, { state: { shouldRefresh: true } })

        } catch (error) {
            console.error("Deck save failed:", error)
            alert("Failed to save deck. See console for details.")
        }

        }

        return (
            <>
            <Navbar />
            <div className="flex">
                <div className="w-[60vw] ml-[2vw] py-[2%] px-[5%]">
                    <PokemonCardGrid handleClickOnCard={handleClickOnCard} />
                </div>
                <div className="mx-auto">
                    <DeckCardGrid
                        pokemons={deck}
                        handleRemoveCard={handleRemoveCard}
                        deckName={deckName}
                        setDeckName={setDeckName}
                        handleCreateDeck={handleCreateDeck}
                        buttonLabel={isEditMode ? "Update Deck" : "Create Deck"}
                    />
                </div>
            </div>
            </>
        )
    }

export default CreateDeckPage
