import { useEffect, useRef, useState } from 'react'
import { useGame } from '../contexts/BattleContext'
import { ACCESS_TOKEN } from '../../constants'
import HandRow from '../components/BattleComponents/HandRow'
import { animateHands } from '../utils/animateHands'
import PriceRow from '../components/BattleComponents/PriceRow'
import DeckPile from '../components/BattleComponents/DeckPile'
import TrashPile from '../components/BattleComponents/TrashPile'
import ActiveRow from '../components/BattleComponents/ActiveRow'
import BenchRow from '../components/BattleComponents/BenchRow'
import ReshuffleButton from '../components/BattleComponents/ReshuffleButton'
import WaitingMessage from '../components/BattleComponents/WaitingMessage'
import PassButton from '../components/BattleComponents/PassButton'

const WEBSOCKET_URL = "ws://192.168.11.10:8000"

function BattlePage() {
    const { battleID, yourDeck } = useGame()
    const socketRef = useRef(null)

    const [playerOneHand, setPlayerOneHand] = useState([])
    const [playerOnePrize, setPlayerOnePrize] = useState([])
    const [playerOneBench, setPlayerOneBench] = useState([])
    const [playerOneActive, setPlayerOneActive] = useState([])
    const [playerOneDeck, setPlayerOneDeck] = useState([])
    const [playerOneTrash, setPlayerOneTrash] = useState([])

    const [playerTwoHand, setPlayerTwoHand] = useState([])
    const [playerTwoPrize, setPlayerTwoPrize] = useState([])
    const [playerTwoBench, setPlayerTwoBench] = useState([])
    const [playerTwoActive, setPlayerTwoActive] = useState([])
    const [playerTwoDeck, setPlayerTwoDeck] = useState([])
    const [playerTwoTrash, setPlayerTwoTrash] = useState([])

    const [hasTane, setHasTane] = useState(null)
    const [waitingForPlayer, setWaitingForPlayer] = useState(false)
    const [readyState, setReadyState] = useState(false)

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
                case "initial_hand": {
                    console.log(data)
                    const playerOneInitHand = data.yourHand
                    const playerTwoInitHand = data.opponentHand
                    setHasTane(data.hasTane)
                    if (data.hasTane) {
                        setPlayerOnePrize(data.yourPrize)
                    }
                    if (data.opponentTane) {
                        setPlayerTwoPrize(data.opponentPrize)
                    } else {
                        setWaitingForPlayer(true)
                    }

                    if (!playerOneInitHand || !playerTwoInitHand) {
                        console.error("Received invalid initial hand data", data)
                        break
                    }

                    animateHands(playerOneInitHand, playerTwoInitHand, setPlayerOneHand, setPlayerTwoHand)
                    break
                }

                case "reshuffled_hand":
                    setHasTane(data.hasTane)
                    if (data.hasTane) {
                        setPlayerOnePrize(data.yourPrize)
                        animateHands(data.yourHand, null, setPlayerOneHand, setPlayerTwoHand)
                        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                            socketRef.current.send(JSON.stringify({
                                type: "reshuffle_done"
                            }))
                        }
                        break
                    }
                    animateHands(data.yourHand, null, setPlayerOneHand, setPlayerTwoHand)
                    break

                case "reshuffle_done":
                    setWaitingForPlayer(false)
                    console.log("REMOVE WAITING INFO")
                    break

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

    const selectStartPokemon = (pokemon) => {
        if (hasTane && !waitingForPlayer) {
            const newHand = [...playerOneHand];

            const index = newHand.findIndex(p => p === pokemon);

            if (index !== -1) {
                newHand.splice(index, 1);
            }

            if (playerOneActive.length > 0 && pokemon.supertype === "たね") {
                const newBench = [...playerOneBench, pokemon];

                setPlayerOneHand(newHand);
                setPlayerOneBench(newBench);

            } else if (pokemon.supertype === "たね") {
                const newActive = [...playerOneActive, pokemon];

                setPlayerOneHand(newHand);
                setPlayerOneActive(newActive);
                setReadyState(true)
            }
        }
    }


    return (
        <div className="flex flex-col justify-between items-center">
            <div className='flex flex-col justify-between h-[100vh]'>

                {/* Opponent */}
                <div className='flex justify-center gap-[10vw] border-2 h-[50%] bg-red-400'>
                    <div className='flex flex-col justify-center items-center w-[15vw] gap-[5vh]'>
                        <DeckPile cards={playerTwoDeck} />
                        <TrashPile cards={playerTwoTrash} />
                    </div>
                    <div className='flex flex-col justify-between items-center gap-[1.5vh]'>
                        <HandRow cards={playerTwoHand} onClick={() => {}} />
                        <BenchRow cards={playerTwoBench} />
                        <ActiveRow cards={playerTwoActive} />
                    </div>
                    <div className='flex flex-col justify-center items-center w-[15vw]'>
                        <PriceRow cards={playerTwoPrize} />
                    </div>
                </div>

                {/* You */}
                <div className='flex justify-center gap-[10vw] border-2 h-[50%] bg-white'>
                    <div className='flex flex-col justify-center items-center w-[15vw]'>
                        <PriceRow cards={playerOnePrize} />
                    </div>
                    <div className='flex flex-col justify-between items-center gap-[1.5vh]'>
                        <ActiveRow cards={playerOneActive} />
                        <BenchRow cards={playerOneBench} />
                        <HandRow cards={playerOneHand} onClick={selectStartPokemon} />
                    </div>
                    <div className='flex flex-col justify-center items-center gap-[5vh] w-[15vw]'>
                        <DeckPile cards={playerOneDeck} />
                        <TrashPile cards={playerOneTrash} />
                    </div>
                </div>

            </div>
            {!hasTane && (<ReshuffleButton onReshuffle={handleReshuffle} />)}
            {hasTane && waitingForPlayer && <WaitingMessage />}
            {readyState && (<PassButton />)}
        </div>
    )
}

export default BattlePage
