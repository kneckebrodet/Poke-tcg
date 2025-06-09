import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { GameProvider } from './contexts/BattleContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    // <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <GameProvider>
                    <App />
                </GameProvider>
            </AuthProvider>
        </BrowserRouter>
    // </React.StrictMode>
)
