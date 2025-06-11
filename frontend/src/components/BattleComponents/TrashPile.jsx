import PokemonCard from '../PokedexComponents/PokemonCard';

function TrashPile({ cards }) {
    return (
        <div className="relative w-[10vw]">
            {cards?.map((card, index) => (
                <div
                    key={index}
                    className="absolute"
                    style={{
                        bottom: `${index * 0.3}px`,    // vertical offset
                        left: `${index * 0.2}px`,   // horizontal offset
                        zIndex: index,            // ensure last cards on top
                    }}
                >
                    <PokemonCard
                        pokemon={card}
                        onClick={() => { }}
                    />
                </div>
            ))}
        </div>
    );
}

export default TrashPile;
