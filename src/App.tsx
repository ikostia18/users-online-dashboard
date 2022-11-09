import './App.css';
import { Route, Routes } from 'react-router-dom';
import Login from './components/Login/Login';
import ListUsers from './components/ListUsers/ListUsers';
import NotFound from './components/NotFound/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="list-users" element={<ListUsers />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
