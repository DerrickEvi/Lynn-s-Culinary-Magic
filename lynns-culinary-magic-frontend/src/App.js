import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import MenuItemsList from './components/MenuItemsList';
import MenuItemForm from './components/MenuItemForm';
import Login from './components/Login';
import Register from './components/Register';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? children : <Navigate to="/login" />;
};

const Navigation = () => {
  const { user, logout } = useAuth();

  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        {user ? (
          <>
            <li><Link to="/menu">Menu Items</Link></li>
            <li><Link to="/add-item">Add New Item</Link></li>
            <li><button onClick={logout}>Logout</button></li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        <Navigation />
        <p>Authentication status: {user ? 'Logged In' : 'Not Logged In'}</p>

        <Routes>
          <Route path="/" element={<h1>Welcome to Lynn's Culinary Magic</h1>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/menu" 
            element={
              <PrivateRoute>
                <MenuItemsList />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/add-item" 
            element={
              <PrivateRoute>
                <MenuItemForm />
              </PrivateRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;