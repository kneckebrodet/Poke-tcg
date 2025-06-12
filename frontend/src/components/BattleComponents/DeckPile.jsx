import PokemonCard from '../PokedexComponents/PokemonCard';


function DeckPile({ cards, onClick }) {
    return (
        <div className="relative w-[15vw] bg-black h-[10vh]">
            {cards?.map((card, index) => (
                <div
                    key={index}
                    className="absolute"
                    style={{
                        bottom: `${index * 0.03}vh`,    // vertical offset
                        left: `${4.5+(index * 0.02)}vw`,   // horizontal offset
                        zIndex: index,            // ensure last cards on top
                    }}
                >
                    <PokemonCard
                        pokemon={card}
                        onClick={() => onClick(card)}
                        className=''
                    />
                </div>
            ))}
        </div>
    );
}

export default DeckPile;
