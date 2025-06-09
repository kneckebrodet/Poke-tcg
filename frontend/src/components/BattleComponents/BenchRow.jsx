import PokemonCard from '../PokedexComponents/PokemonCard';

function BenchRow({ cards, length=5 }) {
    return (
        <div className={`grid max-w-[75vw] min-w-[1vw] min-h-[1vh] gap-2 grid-cols-${length}`}>
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
