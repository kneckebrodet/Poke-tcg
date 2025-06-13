import PokemonCard from '../PokedexComponents/PokemonCard';

function PriceRow({ cards }) {
    return (
        <div className="grid grid-cols-2 gap-[0.3vw]">
            {cards.map((card, index) => (
                <PokemonCard
                    key={index}
                    pokemon={card}
                    onClick={() => {}}
                    className='w-[4.5vw]'
                />
            ))}
        </div>
    );
}

export default PriceRow;
