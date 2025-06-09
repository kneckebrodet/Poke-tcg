import PokemonCard from '../PokedexComponents/PokemonCard';

function ActiveRow({ cards, length=1 }) {
    const gridColsClass = `grid-cols-${length}`;
    return (
        <div className={`grid max-w-[75vw] gap-2 min-h-[1vh] min-w-[1vw] ${gridColsClass}`}>
            {cards.map((card, index) => (
                <PokemonCard
                    key={index}
                    pokemon={card}
                    onClick={() => {}}
                />
            ))}
        </div>
    );
}

export default ActiveRow;
