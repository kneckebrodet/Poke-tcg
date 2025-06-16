import PokemonCard from '../PokedexComponents/PokemonCard';

function ActiveRow({ cards, onClick }) {
    return (
        <div className={"grid max-w-[75vw] gap-2 min-h-[1vh] min-w-[1vw] grid-cols-1"}>
            {cards?.map((card, index) => (
                <PokemonCard
                    key={index}
                    pokemon={card}
                    onClick={() => onClick(card)}
                    className='w-[4.5vw]'
                />
            ))}
        </div>
    );
}

export default ActiveRow;
