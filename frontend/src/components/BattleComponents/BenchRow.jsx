import PokemonCard from '../PokedexComponents/PokemonCard';

function BenchRow({ cards, length=5 }) {
    const gridColsClass = `grid-cols-${length}`;
    return (
        <div className={`grid max-w-[75vw] min-w-[1vw] min-h-[1vh] gap-2 ${gridColsClass}`}>
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

export default BenchRow;
