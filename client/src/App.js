import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard';
import CCTVFeed from './components/CCTVFeed';
import Heatmap from './components/Heatmap';
import AdminDashboard from './components/AdminDashboard';
import HomePage from './components/HomePage';
import Gethelp from './components/Gethelp';
import EmergencyAdmin from './components/EmergencyAdmin';

const App = () => {
  return (
    <Router>  {/* Wrap everything inside BrowserRouter */}
      <Routes>
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/cctv' element={<CCTVFeed />} />
        <Route path='/heatmap' element={<Heatmap />} />
        <Route path='/' element={<HomePage />} />
        <Route path='/admin' element={<EmergencyAdmin />} />
        <Route path='/contact' element={<Gethelp />} />
      </Routes>
    </Router>
  );
};

export default App;
