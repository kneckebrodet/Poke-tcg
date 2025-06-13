import PokemonCard from '../PokedexComponents/PokemonCard';

function TrashPile({ cards, onClick }) {
    return (
        <div className="relative w-full h-full">
            {cards?.map((card, index) => (
                <div
                    key={index}
                    className="absolute"
                    style={{
                        bottom: `${index * 0.5}px`,
                        left: `${index * 0.3}px`,
                        zIndex: index,
                    }}
                >
                    <PokemonCard
                        pokemon={card}
                        onClick={() => onClick(card)}
                        className="w-[4.5vw]"
                    />
                </div>
            ))}
        </div>
    );
}

export default TrashPile;
