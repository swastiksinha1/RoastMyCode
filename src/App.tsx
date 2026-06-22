import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import HomePage from './pages/HomePage';
import RoastPage from './pages/RoastPage';
import HallOfShamePage from './pages/HallOfShamePage';
import BattlePage from './pages/BattlePage';
import BattleResultPage from './pages/BattleResultPage';
import FluidBackground from './components/FluidBackground';

/**
 * Main Application Component
 * Sets up routing, global background, and toast notifications.
 */
function App() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <FluidBackground isActive={true} />
      
      {/* App Content */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/roast" element={<RoastPage />} />
          <Route path="/hall-of-shame" element={<HallOfShamePage />} />
          <Route path="/battle" element={<BattlePage />} />
          <Route path="/battle/result" element={<BattleResultPage />} />
        </Routes>
      </div>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1a1a1a',
            color: '#f5f5f5',
            border: '1px solid #333',
          },
        }}
      />
    </div>
  );
}

export default App;
