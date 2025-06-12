import PokemonCard from '../PokedexComponents/PokemonCard';

function HandRow({ cards, onClick }) {
    return (
        <div className={"grid w-[45vw] bg-green-500 grid-cols-7"}>
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
