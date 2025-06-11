import PokemonCard from '../PokedexComponents/PokemonCard';

function HandRow({ cards, onClick }) {
    let gridColsClass = `grid max-w-[75vw] gap-1 grid-cols-${cards.length}`;
    return (
        <div className={gridColsClass}>
            {cards?.map((card, index) => (
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
