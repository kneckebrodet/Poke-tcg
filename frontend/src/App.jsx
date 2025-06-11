import { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "./contexts/AuthContext"
import { setAuthHandlers } from "./utils/auth"
import { Routes, Route } from 'react-router-dom'
import './index.css'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import LobbyPage from './pages/LobbyPage'
import DeckPage from './pages/DeckPage'
import CreateDeckPage from './pages/CreateDeckPage'
import ProtectedRoute from './components/ProtectedRoute'
import PokedexPage from './pages/PokedexPage'
import BattlePage from './pages/BattlePage'


function App() {
    return (
        <div className='w-[97vw] ml-[1.5vw]'>
            <Routes>
                <Route path="/" element={<PokedexPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route path="/lobby" element={
                    <ProtectedRoute><LobbyPage /></ProtectedRoute>
                } />
                <Route path="/decks" element={
                    <ProtectedRoute><DeckPage /></ProtectedRoute>
                } />
                <Route path="/decks/create" element={
                    <ProtectedRoute><CreateDeckPage /></ProtectedRoute>
                } />
                <Route path="/battle/" element={
                    <ProtectedRoute><BattlePage /></ProtectedRoute>
                } />
            </Routes>
        </div>
    )
}

export default App
