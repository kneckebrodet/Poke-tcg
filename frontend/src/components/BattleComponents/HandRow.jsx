import PokemonCard from '../PokedexComponents/PokemonCard';

function HandRow({ cards, onClick, isOpponent = false }) {
    const cardCount = cards.length;

    let overlap = 0;
    if (cardCount > 55) {
        overlap = -3.7
    }else if (cardCount > 42) {
        overlap = -3.5;
    } else if (cardCount > 31) {
        overlap = -3;
    } else if (cardCount > 23) {
        overlap = -2.5;
    } else if (cardCount > 14) {
        overlap = -2;
    } 

    return (
        <div className="relative flex justify-center bg-purple-500 w-full overflow-visible">
            {cards?.map((card, index) => (
                <div
                    key={index}
                    className="relative group"
                    style={{
                        marginLeft: index !== 0 ? `${overlap}vw` : 0,
                    }}
                >
                    <div
                        className={`relative transition-transform duration-150 ease-in-out hover:scale-150 
                            ${isOpponent ? 'origin-top' : 'origin-bottom'} 
                            z-[${index}] hover:z-[999]`}
                    >
                        <PokemonCard
                            pokemon={card}
                            onClick={() => onClick(card)}
                            className="w-[4.5vw]"
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default HandRow;
