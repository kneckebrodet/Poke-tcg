import { createContext, useContext, useState } from 'react';

const GameContext = createContext();

export function GameProvider({ children }) {
    const [playerID, setPlayerID] = useState(null)
    const [battleID, setBattleID] = useState(null);
    const [opponentUsername, setOpponentUsername] = useState('');
    const [yourDeck, setYourDeck] = useState(null);
    const [opponentDeck, setOpponentDeck] = useState(null);

    return (
        <GameContext.Provider value={{
            playerID,
            battleID,
            setBattleID,
            opponentUsername,
            setOpponentUsername,
            yourDeck,
            setYourDeck,
            opponentDeck,
            setOpponentDeck
        }}>
            {children}
        </GameContext.Provider>
    );
}

export function useGame() {
    return useContext(GameContext);
}
