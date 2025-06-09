import PokemonCard from '../PokedexComponents/PokemonCard';

function ActiveRow({ cards, length=1 }) {
    return (
        <div className={`grid max-w-[75vw] gap-2 min-h-[1vh] min-w-[1vw] grid-cols-${length}`}>
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
