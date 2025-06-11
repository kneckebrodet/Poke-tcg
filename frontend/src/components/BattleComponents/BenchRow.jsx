import PokemonCard from '../PokedexComponents/PokemonCard';

function BenchRow({ cards }) {
    const gridColsClass = `grid max-w-[75vw] min-w-[1vw] min-h-[1vh] gap-2 grid-cols-${cards.length}`;
    return (
        <div className={gridColsClass}>
            {cards?.map((card, index) => (
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
