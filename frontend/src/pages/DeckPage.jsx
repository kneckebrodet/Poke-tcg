import { useNavigate } from "react-router-dom"
import Button from "../components/Button"
import DeckGrid from "../components/DeckComponents/DeckGrid"
import { useContext, useEffect, useState } from "react"
import api from '../utils/api_tool'
import { AuthContext } from "../contexts/AuthContext"
import Navbar from "../components/Navbar"

function DeckPage() {
    const [decks, setDecks] = useState([])
    const { logout } = useContext(AuthContext)
    const navigate = useNavigate()

    const fetchDecks = async () => {
        try {
            const res = await api.get('/decks/')
            setDecks(res.data.results)
        } catch (err) {
            console.error('Failed to fetch decks:', err)

            if (err.response && err.response.status === 401) {
                logout()
                navigate("/login")
            }
        }
    }

    useEffect(() => {
        fetchDecks()
    }, [])

    const handleDeleteDeck = async (deck) => {
        try {
            await api.delete(`decks/delete/${deck.id}/`)
        } catch (err) {
            console.error(`Error: ${err}`)
        }
    }

    return (
        <>
        <Navbar />
        <div className="flex h-[80vh] items-center justify-between px-[15vw]">
            <DeckGrid decks={decks} />
            <div className="flex flex-col gap-5">
                <Button onClick={() => navigate('/decks/create')}>New Deck</Button>
                <Button onClick={() => handleDeleteDeck(decks[0])}>Delete</Button>
            </div>
        </div>
        </>
    )
}

export default DeckPage
