import PokemonCard from "../PokedexComponents/PokemonCard"

function FailedHands({ failedHands, title = "Failed Hands" }) {
    return (
        <div className="p-4 bg-gray-800 rounded-xl shadow-md text-white">
            <h2 className="text-lg font-semibold mb-2">{title}</h2>
            <div className="space-y-1 max-h-[30vh] overflow-auto">
                {failedHands.map((hand, i) => (
                    <div key={i} className="flex">
                        {hand.map((card, j) => (
                            <PokemonCard key={j} pokemon={card} className="w-[2vw]" />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default FailedHands
