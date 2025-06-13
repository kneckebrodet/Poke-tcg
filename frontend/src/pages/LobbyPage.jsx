import { useEffect, useRef, useState } from 'react';
import { checkAuth } from '../utils/auth';
import { ACCESS_TOKEN } from '../../constants';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/BattleContext';
import Navbar from "../components/Navbar"

const WEBSOCKET_URL = `ws://${import.meta.env.VITE_BACK_URL.split('://')[1]}`

function LobbyPage() {
    const {
        setBattleID,
        setOpponentUsername,
        setYourDeck,
        setOpponentDeck
    } = useGame();

    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [username, setUsername] = useState("");
    const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
    const [isChallenged, setIsChallenged] = useState(false);
    const [challenger, setChallenger] = useState(null);
    const [deckSelectionPopup, setDeckSelectionPopup] = useState(false);
    const [decks, setDecks] = useState([]);
    const [isWaitingForOpponent, setIsWaitingForOpponent] = useState(false)

    const socketRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        let socket;

        async function connectSocket() {
            const isAuthenticated = await checkAuth();
            if (!isAuthenticated) {
                console.warn("Not authenticated. Skipping WebSocket connection.");
                return;
            }

            const validAccessToken = localStorage.getItem(ACCESS_TOKEN) || sessionStorage.getItem(ACCESS_TOKEN);
            socket = new WebSocket(`${WEBSOCKET_URL}/ws/socket/?token=${validAccessToken}`);
            socketRef.current = socket;

            socket.onopen = () => {
                socket.send(JSON.stringify({ message: "Frontend connected!" }));
            };

            socket.onmessage = (e) => {
                const data = JSON.parse(e.data);

                if (data.type === "init" && data.current_user) {
                    setUsername(data.current_user);
                }
                if (data.type === "user_list") {
                    setUsers(data.users);
                }
                if (data.type === "challenge_notification") {
                    setChallenger(data.from);
                    setIsChallenged(true)
                }
                if (data.type === "challenge_declined") {
                    setSelectedUser(null)
                    setIsWaitingForOpponent(false)
                }
                if (data.type === "challenge_accepted") {
                    setIsWaitingForOpponent(false)
                    setDeckSelectionPopup(true);
                    setDecks(data.decks);
                }
                if (data.type === "cancel_matchmaking") {
                    setIsChallenged(false)
                    closeMatchmaking()
                }
                if (data.type === "start_battle") {
                    setOpponentUsername(data.opponent);
                    setOpponentDeck(data.opponent_deck);
                    setBattleID(data.battle_id)
                    navigate(`/battle`);
                }
            };

            socket.onerror = (e) => {
                console.error("WebSocket error:", e);
            };

            socket.onclose = () => {
                console.log("WebSocket connection closed");
            };
        }

        connectSocket();

        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, []);

    const closeMatchmaking = () => {
        if (deckSelectionPopup) {
            socketRef.current.send(JSON.stringify({
                type: "opponent_left",
                to: challenger || selectedUser,
            }))
        }
        setSelectedUser(null)
        setChallenger(null)
        setIsChallenged(false)
        setIsWaitingForOpponent(false)
        setDeckSelectionPopup(false)
        setDecks([])
    }

    const handleUserClick = (user, e) => {
        if (user === username) return;
        setSelectedUser(user);
        setPopupPosition({ x: e.clientX, y: e.clientY });
    };

    const handleClosePlayerMenu = () => {
        setSelectedUser(null);
    };

    const handleSendChallenge = () => {
        setChallenger(username)
        if (socketRef.current && selectedUser) {
            socketRef.current.send(JSON.stringify({
                type: "challenge_request",
                to: selectedUser,
            }));
        }
        setIsWaitingForOpponent(true)
    };

    const handleDeclineChallenge = () => {
        setIsChallenged(false)
        if (socketRef.current && challenger) {
            socketRef.current.send(JSON.stringify({
                type: "challenge_declined",
                from: username,
                to: challenger,
            }))
        }
    }

    const handleAcceptChallenge = () => {
        setIsChallenged(false)
        socketRef.current.send(JSON.stringify({
            type: "challenge_accepted",
            to: challenger,
        }));
    };

    const handleDeckSelected = (deck) => {
        setDeckSelectionPopup(false);
        setIsWaitingForOpponent(true);
        setYourDeck(deck)

        if (socketRef.current && username) {
            socketRef.current.send(JSON.stringify({
                type: "deck_selected",
                user: username,
                deck: deck,
                opponent: selectedUser || challenger
            }));
        }
    };

    const handleCancelMatchmaking = () => {
        if (socketRef.current && username) {
            socketRef.current.send(JSON.stringify({
                type: "cancel_matchmaking",
                to: selectedUser || challenger,
            }));
        }
        closeMatchmaking()
    };

    function DeckSelectionPopup({ decks, onClose, onSelect }) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-6 rounded shadow-md w-[30vw] max-h-[70vh] overflow-y-auto">
                    <h2 className="text-lg font-bold mb-4">Select a Deck</h2>
                    {decks.length > 0 ? (
                        <ul className="space-y-2">
                            {decks.map((deck, idx) => (
                                <li key={idx} className="border p-2 rounded hover:bg-gray-100 cursor-pointer"
                                    onClick={() => onSelect(deck)}>
                                    <strong>{deck.name}</strong> ({deck.cards.length} cards)
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No decks available.</p>
                    )}
                    <div className="mt-4 flex justify-end">
                        <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
        <Navbar />
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">LOBBY</h1>

            {users && users.length > 0 ? (
                <ul className="flex flex-col items-center w-[15vw] p-[1vw] border rounded-lg shadow">
                    {users.map((user, index) => (
                        <li
                            key={index}
                            className="select-none hover:underline cursor-pointer"
                            onClick={(e) => handleUserClick(user, e)}
                        >
                            {user}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Loading users...</p>
            )}

            {selectedUser && (
                <div
                    className="absolute z-50"
                    style={{ left: popupPosition.x, top: popupPosition.y }}
                >
                    <div className="flex flex-col justify-center items-center bg-white shadow-md w-[10vw] border border-gray-200 rounded p-4">
                        <p className="underline mb-4"><strong>{selectedUser}</strong></p>
                        <div className="flex flex-col gap-2 w-full">
                            <button className="border border-gray-200 bg-gray-100 rounded shadow hover:shadow-md" onClick={handleSendChallenge}>Challenge</button>
                            <button className="border border-gray-200 bg-gray-100 rounded shadow hover:shadow-md" onClick={() => alert("Stats logic goes here!")}>Stats</button>
                        </div>
                        <button className="mt-4 w-full border border-gray-200 bg-gray-100 rounded shadow hover:shadow-md" onClick={handleClosePlayerMenu}>Cancel</button>
                    </div>
                </div>
            )}

            {isChallenged && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded shadow-md">
                        <p><strong>{challenger}</strong> has challenged you!</p>
                        <div className="mt-4 flex justify-center gap-4">
                            <button onClick={handleAcceptChallenge} className="px-4 py-2 bg-green-500 text-white rounded">Accept</button>
                            <button onClick={handleDeclineChallenge} className="px-4 py-2 bg-red-500 text-white rounded">Decline</button>
                        </div>
                    </div>
                </div>
            )}

            {deckSelectionPopup && (
                <DeckSelectionPopup decks={decks} onClose={handleCancelMatchmaking} onSelect={handleDeckSelected} />
            )}

            {isWaitingForOpponent && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded shadow-md text-center">
                        <p className="text-lg font-semibold mb-4">Waiting for opponent...</p>
                        <button onClick={handleCancelMatchmaking} className="px-4 py-2 bg-red-500 text-white rounded">
                            Cancel
                        </button>
                    </div>
                </div>
            )}

        </div>
        </>
    );
}

export default LobbyPage;
