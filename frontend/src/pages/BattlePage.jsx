import { useContext, useEffect, useRef, useState } from 'react'
import { useGame } from '../contexts/BattleContext'
import { ACCESS_TOKEN } from '../../constants'
import { animateHands } from '../utils/animateHands'
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


    const [hasTane, setHasTane] = useState(null)
    const [waitingForPlayer, setWaitingForPlayer] = useState(false)

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

                    const { gameState: serverGameState, hasTane, opponentTane } = data;

                    if (!serverGameState?.playerOne || !serverGameState?.playerTwo) {
                        console.error("Invalid gameState structure:", data);
                        break;
                    }

                    setGameState(serverGameState);
                    setHasTane(hasTane);

                    if (!opponentTane) {
                        setWaitingForPlayer(true);
                    }

                    break;
                }

                default:
                    break
            }
        }

        socket.onerror = (e) => console.error("Battle socket error:", e)
        socket.onclose = () => console.log("Battle socket closed")

        return () => socket.close()
    }, [battleID])

    const handleReshuffle = () => {
        console.log("Reshuffling...")
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({
                type: "reshuffle"
            }))
        }
    }

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
            {!hasTane && (<ReshuffleButton onReshuffle={handleReshuffle} />)}
            {hasTane && waitingForPlayer && <WaitingMessage />}
            {/* {readyState && (<PassButton />)} */}
        </div>
    )
}

export default BattlePage
