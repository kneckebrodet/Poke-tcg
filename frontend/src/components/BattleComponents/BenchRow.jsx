import PokemonCard from '../PokedexComponents/PokemonCard';

function BenchRow({ cards, onClick }) {
    return (
        <div className={"grid max-w-[75vw] min-w-[1vw] min-h-[1vh] gap-2 grid-cols-5"}>
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

export default BenchRow;
