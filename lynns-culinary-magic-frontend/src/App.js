import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MenuItemsList from './components/MenuItemsList';
import MenuItemForm from './components/MenuItemForm';

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/menu">Menu Items</Link></li>
            <li><Link to="/add-item">Add New Item</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<h1>Welcome to Lynn's Culinary Magic</h1>} />
          <Route path="/menu" element={<MenuItemsList />} />
          <Route path="/add-item" element={<MenuItemForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;