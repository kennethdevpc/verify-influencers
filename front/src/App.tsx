import './App.css';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ResearchTaskPage from './pages/ResearchTaskPage';
import Leaderboard from './pages/Leaderboard';
import Influencer from './pages/Influencer';
import ReturnDashboard from './components/ReturnDashboard';

function App() {
  return (
    <div className="text-white">
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/research-tasks" element={<ResearchTaskPage />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/influencer/:id" element={<Influencer />} />
      </Routes>
    </div>
  );
}

export default App;
