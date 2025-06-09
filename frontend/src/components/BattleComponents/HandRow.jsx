import PokemonCard from '../PokedexComponents/PokemonCard';

function HandRow({ cards, length=7 }) {
    return (
        <div className={`grid max-w-[75vw] gap-2 grid-cols-${length}`}>
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

export default HandRow;
