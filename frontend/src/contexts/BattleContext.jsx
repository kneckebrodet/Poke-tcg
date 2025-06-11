import { createContext, useEffect, useContext, useState } from 'react';

const GameContext = createContext();

export function GameProvider({ children }) {
    const [playerID, setPlayerID] = useState(null)
    const [battleID, setBattleIDState] = useState(null);
    const [opponentUsername, setOpponentUsername] = useState('');
    const [yourDeck, setYourDeck] = useState(null);
    const [opponentDeck, setOpponentDeck] = useState(null);

    useEffect(() => {
        const storedBattleID = sessionStorage.getItem("battleID");
        if (storedBattleID) {
            setBattleIDState(storedBattleID);
        }
    }, []);

    const setBattleID = (id) => {
        sessionStorage.setItem("battleID", id);
        setBattleIDState(id);
    }


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
