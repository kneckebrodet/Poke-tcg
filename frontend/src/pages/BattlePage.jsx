import { useEffect, useRef, useState } from 'react'
import { useGame } from '../contexts/BattleContext'
import { ACCESS_TOKEN } from '../../constants'
import ReshuffleButton from '../components/BattleComponents/ReshuffleButton'
import WaitingMessage from '../components/BattleComponents/WaitingMessage'
import PassButton from '../components/BattleComponents/PassButton'
import PlayerSide from '../components/BattleComponents/playerSide'

const WEBSOCKET_URL = "ws://192.168.11.10:8000"

function BattlePage() {
    const { battleID, yourDeck } = useGame()
    const socketRef = useRef(null)

    const [gameState, setGameState] = useState({
        playerOne: {
            hand: [],
            bench: [],
            active: [],
            prize: [],
            deck: [],
            trash: [],
            // ... other playerOne data
        },
        playerTwo: {
            hand: [],
            bench: [],
            active: [],
            prize: [],
            deck: [],
            trash: [],
            // ... other playerTwo data
        },
        // maybe some global flags like turn, phase, etc.
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

            switch (data.type) {
                case "initial_game_state": {
                    console.log("Initial game state received:", data);
                    const gameStateFromServer = data.gameState

                    // Set game state based on backend response
                    setGameState({
                        playerOne: {
                            hand: gameStateFromServer.playerOne.hand,
                            bench: gameStateFromServer.playerOne.bench,
                            active: gameStateFromServer.playerOne.active,
                            prize: gameStateFromServer.playerOne.prize,
                            deck: gameStateFromServer.playerOne.deck,
                            trash: gameStateFromServer.playerOne.trash,
                        },
                        playerTwo: {
                            hand: gameStateFromServer.playerTwo.hand,
                            bench: gameStateFromServer.playerTwo.bench,
                            active: gameStateFromServer.playerTwo.active,
                            prize: gameStateFromServer.playerTwo.prize,
                            deck: gameStateFromServer.playerTwo.deck,
                            trash: gameStateFromServer.playerTwo.trash,
                        },
                        turn: gameStateFromServer.turn,
                    });


                    break
                }

                case "recover_game_state": {
                    console.log("Initial game state received:", data);
                    const recoveredGameStateFromServer = data.gameState

                    setGameState({
                        playerOne: {
                            hand: recoveredGameStateFromServer.playerOne.hand,
                            bench: recoveredGameStateFromServer.playerOne.bench,
                            active: recoveredGameStateFromServer.playerOne.active,
                            prize: recoveredGameStateFromServer.playerOne.prize,
                            deck: recoveredGameStateFromServer.playerOne.deck,
                            trash: recoveredGameStateFromServer.playerOne.trash,
                        },
                        playerTwo: {
                            hand: recoveredGameStateFromServer.playerTwo.hand,
                            bench: recoveredGameStateFromServer.playerTwo.bench,
                            active: recoveredGameStateFromServer.playerTwo.active,
                            prize: recoveredGameStateFromServer.playerTwo.prize,
                            deck: recoveredGameStateFromServer.playerTwo.deck,
                            trash: recoveredGameStateFromServer.playerTwo.trash,
                        },
                        turn: recoveredGameStateFromServer.turn,
                    });


                    break
                }

                default:
                    break
            }
        }


        socket.onerror = (e) => console.error("Battle socket error:", e)
        socket.onclose = () => console.log("Battle socket closed")

        return () => socket.close()
    }, [])

    return (
        <div className="flex flex-col justify-between items-center">
            <div className='flex flex-col justify-between h-[100vh]'>

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
                    onHandClick={() => { }}
                    onBenchClick={() => { }}
                    onActiveClick={() => { }}
                    onTrashClick={() => { }}
                    onDeckClick={() => { }}

                    isOpponent={false}
                />

            </div>
            {/* {!hasTane && (<ReshuffleButton onReshuffle={handleReshuffle} />)} */}
            {/* {hasTane && waitingForPlayer && <WaitingMessage />} */}
            {/* {readyState && (<PassButton />)} */}
        </div>
    )
}

export default BattlePage
