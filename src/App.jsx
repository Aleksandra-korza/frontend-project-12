import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Signup from './pages/Signup';

import '@mantine/core/styles.css';
import './App.css';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App({ socket }) {
  return (
    <Routes>
      <Route
        path="/"
        element={(
          <PrivateRoute>
            <Home socket={socket} />
          </PrivateRoute>
        )}
      />

      <Route
        path="/login"
        element={(
          <PublicRoute>
            <Login />
          </PublicRoute>
        )}
      />

      <Route
        path="/signup"
        element={(
          <PublicRoute>
            <Signup />
          </PublicRoute>
        )}
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;