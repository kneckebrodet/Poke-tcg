import { Routes, Route } from 'react-router-dom';
import PokedexPage from './pages/PokedexPage';
import './index.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<PokedexPage />} />
    </Routes>
  );
}

export default App;
