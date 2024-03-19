import { Routes, Route } from 'react-router-dom';
import Manager from './pages/Manager';
import Dashboard from './pages/Dashboard';
import ArtistList from './pages/Artirst';
import Tree from './pages/Tree';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Manager />} />
      <Route path='/dashboard' element={<Dashboard />} />
      <Route path='/manager' element={<Manager />} />
      <Route path='/artists' element={<ArtistList />} />
      <Route path='/tree' element={<Tree />} />
    </Routes>
  );
}
export default AppRoutes;