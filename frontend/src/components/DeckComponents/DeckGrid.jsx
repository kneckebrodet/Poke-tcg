import { useNavigate } from "react-router-dom"
import DeckCard from "./DeckCard"

function DeckGrid({ decks }) {
    const navigate = useNavigate()

    const handleClickOnDeck = (deck) => {
        navigate("/decks/create/", {state: { deck }})
    }

    return (
            <div className="grid grid-cols-4 gap-[2vw]">
                {decks.map(deck => (
                    <DeckCard key={deck.id} deck={deck} onClick={() => handleClickOnDeck(deck)} />
                ))}
            </div>
    )
}

export default DeckGrid