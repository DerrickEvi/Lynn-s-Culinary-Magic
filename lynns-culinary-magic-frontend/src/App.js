import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import MenuItemsList from './components/MenuItemsList';
import MenuItemForm from './components/MenuItemForm';

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
            <li><Link to="/forgot-password">Forgot Password</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navigation />

          <Routes>
            <Route path="/" element={<h1>Welcome to Lynn's Culinary Magic</h1>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
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
    </AuthProvider>
  );
}

export default App;