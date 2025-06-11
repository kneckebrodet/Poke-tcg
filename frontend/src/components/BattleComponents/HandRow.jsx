import PokemonCard from '../PokedexComponents/PokemonCard';

function HandRow({ cards, onClick, length=7 }) {
    let gridColsClass = `grid-cols-${length}`;
    return (
        <div className={`grid max-w-[75vw] gap-2 grid-cols-7`}>
            {cards.map((card, index) => (
                <PokemonCard
                    key={index}
                    pokemon={card}
                    onClick={() => onClick(card)}
                />
            ))}
        </div>
    );
}

export default HandRow;
