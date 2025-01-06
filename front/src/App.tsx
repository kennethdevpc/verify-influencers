import { useState } from 'react';
import './App.css';
import { Link, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ResearchTaskPage from './pages/ResearchTaskPage';
import { MoveLeft } from 'lucide-react';

function App() {
  return (
    <div className="text-white">
      <Navbar />
      <div className="container mx-auto flex items-center gap-4 mb-6 py-20">
        <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
          <div className="size-9 rounded-lg  flex items-center justify-center">
            <MoveLeft className="w-5 h-5 text-green-400" />
          </div>
          <h3 className="    text-transparent bg-clip-text bg-gradient-to-r from-green-400  to-emerald-600">
            Back to Dashboard
          </h3>
        </Link>
        <h2 className="text-2xl font-semibold mb-4">Research Tasks</h2>
      </div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/research-tasks" element={<ResearchTaskPage />} />
        <Route path="/leaderboard" element={<h1>leaderboard</h1>} />
        <Route path="/influencer/:id" element={<h1>influencer/:id</h1>} />
      </Routes>
    </div>
  );
}

export default App;
