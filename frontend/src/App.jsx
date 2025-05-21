import { Routes, Route } from 'react-router-dom';
import PokedexPage from './pages/PokedexPage';
import './index.css'
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<PokedexPage />} />
        <Route path='/login' element={<LoginPage />} />
      </Routes>
    </>
  );
}

export default App;
