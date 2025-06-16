import { useEffect, useRef, useState } from 'react'
import { useGame } from '../contexts/BattleContext'
import { ACCESS_TOKEN } from '../../constants'
import GamePhase from '../utils/GamePhase'
import ReshuffleButton from '../components/BattleComponents/ReshuffleButton'
import MessageBox from '../components/BattleComponents/MessageBox'
import PassButton from '../components/BattleComponents/PassButton'
import PlayerSide from '../components/BattleComponents/PlayerSide'
import FailedHands from '../components/BattleComponents/FailedHands'
import DrawCardWheel from '../components/BattleComponents/DrawCardWheel'

const WEBSOCKET_URL = `ws://${import.meta.env.VITE_BACK_URL.split('://')[1]}`

function BattlePage() {
    const { battleID, yourDeck } = useGame()
    const socketRef = useRef(null)

    const [isReshuffling, setIsReshuffling] = useState(false)
    const [displayMessage, setDisplayMessage] = useState(false)
    const [isSelectingBonus, setIsSelectingBonus] = useState(false)
    const [message, setMessage] = useState("Waiting for other player...")
    const [isReady, setIsReady] = useState(false)

    const [gameState, setGameState] = useState({
        playerOne: {
            hand: [], bench: [], active: [], prize: [], deck: [], trash: [], bonus_cards: [],
        },
        playerTwo: {
            hand: [], bench: [], active: [], prize: [], deck: [], trash: [], bonus_cards: [],
        },
        turn: "",
        phase: "",
    })

    // Setup WebSocket
    useEffect(() => {
        const token = localStorage.getItem(ACCESS_TOKEN) || sessionStorage.getItem(ACCESS_TOKEN)
        if (!token) return

        const socket = new WebSocket(`${WEBSOCKET_URL}/ws/battle/${battleID}/?token=${token}`)
        socketRef.current = socket

        socket.onopen = () => {
            console.log("Connected to battle socket")
            socket.send(JSON.stringify({
                type: "game_init",
                deck: yourDeck
            }))
        }

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data)
            const state = data.gameState
            console.log(data)

            switch (data.type) {
                case "initial_game_state":
                case "recover_game_state": {
                    const reshuffles = state.playerOne.reshuffles
                    const failedHands = state.playerOne.failed_hands

                    // only draw prize cards after mulligan
                    if (state.playerTwo.reshuffles === state.playerTwo.failed_hands.length) {
                        state.playerTwo.prize = data.gameState.playerTwo.prize
                    } else {
                        state.playerTwo.prize = []
                    }

                    if (state.phase === GamePhase.SETUP) {
                        if (failedHands && reshuffles < failedHands.length) {
                            state.playerOne.hand = failedHands[reshuffles]
                            state.playerOne.prize = []
                            setIsReshuffling(true)
                        } else {
                            setIsReshuffling(false)
                            state.playerOne.prize = data.gameState.playerOne.prize
                        }
                    }

                    setGameState({
                        playerOne: { ...state.playerOne },
                        playerTwo: { ...state.playerTwo },
                        turn: state.turn,
                        phase: state.phase,
                    })
                    break;
                }
                case "bonus_cards_dealt": {
                    console.log("Bonus cards were dealt!")
                    state.playerOne.hand = [...state.playerOne.hand, ...state.playerOne.bonus_cards]
                    state.playerTwo.hand = [...state.playerTwo.hand, ...state.playerTwo.bonus_cards]

                    setGameState({
                        playerOne: { ...state.playerOne },
                        playerTwo: { ...state.playerTwo },
                        turn: state.turn,
                        phase: state.phase,
                    })
                    break;
                }
                case "active_selected": {
                    setDisplayMessage(false)
                    setIsReady(false)

                    setGameState({
                        playerOne: { ...state.playerOne },
                        playerTwo: { ...state.playerTwo },
                        turn: state.turn,
                        phase: state.phase,
                    })
                    break;
                }
                case "waiting_for_opponent_active_selection": {
                    setMessage("Waiting for opponent to choose active pokemon...")
                    setIsReady(false)
                    setDisplayMessage(true)
                    break
                }
            }
        }

        socket.onerror = (e) => console.error("Battle socket error:", e)
        socket.onclose = () => console.log("Battle socket closed")

        return () => socket.close()
    }, [])

    useEffect(() => {
        if (
            gameState.phase === GamePhase.SETUP &&
            !isReshuffling &&
            gameState.playerTwo.failed_hands.length > 0 &&
            gameState.playerTwo.reshuffles < gameState.playerTwo.failed_hands.length
        ) {
            // trigger an animation here
            setDisplayMessage(true)
            setMessage("Opponent is reshuffling...")
            console.log("Opponent is reshuffling...")
        } else if (
            gameState.phase === GamePhase.SETUP &&
            gameState.playerTwo.failed_hands.length > 0 &&
            gameState.playerTwo.reshuffles === gameState.playerTwo.failed_hands.length
        ) {
            // display bonus cards selection
            setIsSelectingBonus(true)
        } else {
            setDisplayMessage(false)
        }
    }, [gameState.playerTwo.reshuffles])

    useEffect(() => {
        if (gameState.phase === GamePhase.SELECT_ACTIVE) {
            setDisplayMessage(true)
            setMessage("Choose Active pokemon!")
        }
    }, [gameState.phase])

    function handleReshuffle() {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({ type: "reshuffle" }))
        }
    }

    const handleClickOnHand = (pokemon) => {
        if (gameState.phase === GamePhase.SELECT_ACTIVE) {
            if (pokemon.supertype === "たね") {
                if (gameState.playerOne.active.length === 0) {
                    const newHand = gameState.playerOne.hand.filter(
                        (card) => card !== pokemon
                    );
                    const newActive = [pokemon];

                    setGameState((prevState) => ({
                        ...prevState,
                        playerOne: {
                            ...prevState.playerOne,
                            hand: newHand,
                            active: newActive,
                        }
                    }));
                    setIsReady(true)
                } else {
                    const newHand = gameState.playerOne.hand.filter(
                        (card) => card !== pokemon
                    );
                    const newBench = [...gameState.playerOne.bench, pokemon];

                    setGameState((prevState) => ({
                        ...prevState,
                        playerOne: {
                            ...prevState.playerOne,
                            hand: newHand,
                            bench: newBench,
                        }
                    }));
                }
            }
        }
    };

    const handleClickOnActive = (pokemon) => {
        if (gameState.phase === GamePhase.SELECT_ACTIVE) {
            const newActive = gameState.playerOne.active.filter(
                (card) => card !== pokemon
            );
            const newHand = [...gameState.playerOne.hand, pokemon];

            setGameState((prevState) => ({
                ...prevState,
                playerOne: {
                    ...prevState.playerOne,
                    active: newActive,
                    hand: newHand,
                }
            }));
            if (newActive.length < 1){
                setIsReady(false)
            }
        }
    };

    const handleClickOnBench = (pokemon) => {
        if (gameState.phase === GamePhase.SELECT_ACTIVE) {
            const newBench = gameState.playerOne.bench.filter(
                (card) => card !== pokemon
            );
            const newHand = [...gameState.playerOne.hand, pokemon];

            setGameState((prevState) => ({
                ...prevState,
                playerOne: {
                    ...prevState.playerOne,
                    bench: newBench,
                    hand: newHand,
                }
            }));
        }
    };

    const handleReadyClick = () => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({ type: "active_selected", active: gameState.playerOne.active, bench: gameState.playerOne.bench}))
        }
    }

    return (
        <div className="flex flex-col justify-between items-center">
            <div className='flex flex-col justify-between h-[100vh] w-[100%] overflow-hidden'>

                <PlayerSide
                    data={gameState["playerTwo"]}

                    onPrizeClick={() => { }}
                    onHandClick={() => { }}
                    onBenchClick={() => { }}
                    onActiveClick={() => { }}
                    onTrashClick={() => { }}
                    onDeckClick={() => { }}

                    isOpponent={true}
                />

                <PlayerSide
                    data={gameState["playerOne"]}

                    onPrizeClick={() => { }}
                    onHandClick={handleClickOnHand}
                    onBenchClick={handleClickOnBench}
                    onActiveClick={handleClickOnActive}
                    onTrashClick={() => { }}
                    onDeckClick={() => { }}

                    isOpponent={false}
                />

            </div>
            {isReshuffling && (<ReshuffleButton onReshuffle={handleReshuffle} />)}
            {displayMessage && <MessageBox message={message} />}
            {isSelectingBonus && !isReshuffling && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-70 p-6 rounded-lg z-50">
                    <div className="flex space-x-6">
                        <FailedHands
                            failedHands={gameState.playerTwo.failed_hands}
                            title="Opponent's Mulligans"
                        />
                        <DrawCardWheel
                            max={gameState.playerTwo.reshuffles}
                            onSelect={(num) => {
                                console.log("You chose to draw", num, "bonus cards")
                                socketRef.current.send(JSON.stringify({ type: "draw_bonus_cards", amount: num }))
                                setIsSelectingBonus(false)
                                setIsReshuffling(false)
                                setMessage("Waiting for opponent...")
                                setDisplayMessage(true)
                            }}
                        />
                    </div>
                </div>
            )}
            {isReady && (<PassButton onClick={handleReadyClick} message={gameState.phase === GamePhase.SELECT_ACTIVE ? "ready" : "pass"} />)}
        </div>
    )
}

export default BattlePage
