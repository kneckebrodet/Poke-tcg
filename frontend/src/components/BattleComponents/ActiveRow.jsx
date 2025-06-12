import PokemonCard from '../PokedexComponents/PokemonCard';

function ActiveRow({ cards }) {
    return (
        <div className={"grid max-w-[75vw] gap-2 min-h-[1vh] min-w-[1vw] grid-cols-1 bg-blue-500"}>
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

export default ActiveRow;
