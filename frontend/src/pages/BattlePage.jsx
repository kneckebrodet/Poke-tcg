import { useEffect, useRef, useState } from 'react'
import { useGame } from '../contexts/BattleContext'
import { ACCESS_TOKEN } from '../../constants'
import GamePhase from '../utils/GamePhase'
import ReshuffleButton from '../components/BattleComponents/ReshuffleButton'
import WaitingMessage from '../components/BattleComponents/WaitingMessage'
import PassButton from '../components/BattleComponents/PassButton'
import PlayerSide from '../components/BattleComponents/PlayerSide'

const WEBSOCKET_URL = `ws://${import.meta.env.VITE_BACK_URL.split('://')[1]}`

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
            bonus_cards: [],
        },
        playerTwo: {
            hand: [],
            bench: [],
            active: [],
            prize: [],
            deck: [],
            trash: [],
            bonus_cards: [],
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
            console.log(data)

            switch (data.type) {
                case "initial_game_state":
                case "recover_game_state": {
                    const gameStateFromServer = data.gameState

                    // for testing the trash pile visuals
                    gameStateFromServer.playerOne.trash = [...gameStateFromServer.playerOne.deck]
                    gameStateFromServer.playerTwo.trash = [...gameStateFromServer.playerTwo.deck]

                    setGameState({
                        playerOne: { ...gameStateFromServer.playerOne },
                        playerTwo: { ...gameStateFromServer.playerTwo },
                        turn: gameStateFromServer.turn,
                        phase: gameStateFromServer.phase
                    });

                    if (gameStateFromServer.phase === GamePhase.SETUP) {
                        console.log("We're in the SETUP state")
                    }
                    break;
                }
            }
        }

        socket.onerror = (e) => console.error("Battle socket error:", e)
        socket.onclose = () => console.log("Battle socket closed")

        return () => socket.close()
    }, [])

    return (
        <div className="flex flex-col justify-between items-center">
            <div className='flex flex-col justify-between h-[100vh] w-[100%]'>

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
