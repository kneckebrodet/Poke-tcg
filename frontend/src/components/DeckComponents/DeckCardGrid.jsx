import ScrollContainer from 'react-indiana-drag-scroll'
import 'react-indiana-drag-scroll/dist/style.css'

import Button from "../Button"
import PokemonCard from "../PokedexComponents/PokemonCard"
import { useNavigate } from 'react-router-dom'

function DeckCardGrid({ pokemons, handleRemoveCard, deckName, setDeckName, handleCreateDeck, buttonLabel }) {
    const grouped = {}
    pokemons.forEach(pokemon => {
        if (grouped[pokemon.id]) {
            grouped[pokemon.id].count += 1
        } else {
            grouped[pokemon.id] = { ...pokemon, count: 1 }
        }
    })

    const typeOrder = [
        "ポケモン",
        "グッズ",
        "サポート",
        "ポケモンのどうぐ",
        "スタジアム",
        "基本エネルギー",
        "特殊エネルギー"
    ];

    const supertypeOrder = {
        "たね": 0,
        "1 進化": 1,
        "2 進化": 2
    };

    function getEvolutionRoot(card) {
        if (!card.evolution_line) {
            return card.card_name; 
        }

        const stages = card.evolution_line
            .split(',')
            .map(s => s.trim());

        if (card.supertype === 'たね') {
            return card.card_name;
        }

        const possibleRoots = stages.filter(name => name !== card.card_name);

        if (possibleRoots.length > 0) {
            return possibleRoots[possibleRoots.length - 1];
        }

        return card.card_name; 
    }


    function cardSort(cards) {
        return cards.slice().sort((a, b) => {
            const typeA = typeOrder.indexOf(a.card_type || "");
            const typeB = typeOrder.indexOf(b.card_type || "");
            if (typeA !== typeB) return typeA - typeB;

            const rootA = getEvolutionRoot(a);
            const rootB = getEvolutionRoot(b);
            if (rootA !== rootB) return rootA.localeCompare(rootB, 'ja');

            const superA = supertypeOrder[a.supertype] ?? 99;
            const superB = supertypeOrder[b.supertype] ?? 99;
            if (superA !== superB) return superA - superB;

            return a.card_name.localeCompare(b.card_name, 'ja');
        });
    }

    const cardAmount = pokemons.length;
    const uniquePokemons = Object.values(grouped);
    const sortedCards = cardSort(uniquePokemons);

    const cardLimit = 60;
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-between sticky top-[15vh] border-1 border-gray-300 rounded-[10px] shadow-lg/30 p-[5%] h-[80vh] w-[26vw]">
            <div className='flex flex-col items-center w-[100%] gap-[3vh]'>
                <div className='flex justify-between gap-[1vw] w-[100%] px-[5%]'>
                    <input
                        className="w-[70%] border-[.1em] border-gray-400 rounded-[10px] px-[1vw] text-sm h-[2em] shadow-inner/10"
                        placeholder="Deck name:"
                        value={deckName}
                        onChange={(e) => setDeckName(e.target.value)}
                    />
                    <div className={cardAmount === cardLimit ? 'text-green-500' : 'text-red-500'}>
                        {cardAmount} / {cardLimit}
                    </div>
                </div>

                <ScrollContainer
                    className="grid grid-cols-4 w-[90%] border-1 border-gray-300 rounded-[10px] shadow-inner/40 p-[3%] max-h-[50vh] overflow-y-auto scrollbar-hide"
                    vertical={true}
                    horizontal={false}
                >
                    {sortedCards.map(pokemon => (
                        <div key={pokemon.id} className="flex flex-col mx-auto items-center w-[80%]">
                            <PokemonCard
                                pokemon={pokemon}
                                onClick={() => handleRemoveCard(pokemon)}
                            />
                            <span className="text-xs text-gray-600 font-semibold mb-[1vh]">
                                ×{pokemon.count}
                            </span>
                        </div>
                    ))}
                </ScrollContainer>
            </div>

            <div className="flex flex-col items-center gap-[1vh]">
                <Button className="h-[50%]" onClick={handleCreateDeck}>{buttonLabel}</Button>
                <Button className="h-[40%] w-[95%] text-sm" color="red" onClick={() => navigate("/decks")}>Cancel</Button>
            </div>
        </div>
    )
}

export default DeckCardGrid;
