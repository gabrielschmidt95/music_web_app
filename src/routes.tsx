import { Routes, Route } from 'react-router-dom';
import Manager from './pages/Manager';
import Dashboard from './pages/Dashboard';
import ArtistList from './pages/Artirst';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Manager />} />
      <Route path='/dashboard' element={<Dashboard />} />
      <Route path='/manager' element={<Manager />} />
      <Route path='/artists' element={<ArtistList />} />
    </Routes>
  );
}
export default AppRoutes;