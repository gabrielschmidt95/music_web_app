import { Routes, Route } from 'react-router-dom';
import Manager from './pages/Manager';
import Dashboard from './pages/Dashboard';
import Tree from './pages/Tree';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Manager />} />
      <Route path='/dashboard' element={<Dashboard />} />
      <Route path='/manager' element={<Manager />} />
      <Route path='/tree' element={<Tree />} />
    </Routes>
  );
}
export default AppRoutes;