import PokemonCard from '../PokedexComponents/PokemonCard';

function DeckPile({ cards }) {
    return (
        <div className="grid grid-cols-1 w-[6vw]">
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

export default DeckPile;
