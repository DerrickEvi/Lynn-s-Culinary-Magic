import React, { useState } from 'react';
import axios from 'axios';

const MenuItemForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await axios.post("http://localhost:5000/api/menu-items", formData);
      console.log("Full response:", response);
      if (response.data.success) {
        setSuccess('Menu item added successfully!');
        setFormData({ name: '', description: '', price: '', category: '' });
      } else {
        throw new Error(response.data.message || "Failed to add menu item");
      }
    } catch (error) {
      console.error("Error object:", error);
      if (error.response) {
        console.error("Error response:", error.response);
      }
      setError("Error adding menu item. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{color: 'red'}}>{error}</p>}
      {success && <p style={{color: 'green'}}>{success}</p>}
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Item Name"
        required
      />
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
        required
      />
      <input
        type="number"
        name="price"
        value={formData.price}
        onChange={handleChange}
        placeholder="Price"
        required
      />
      <select
        name="category"
        value={formData.category}
        onChange={handleChange}
        required
      >
        <option value="">Select Category</option>
        <option value="Appetizer">Appetizer</option>
        <option value="Main Course">Main Course</option>
        <option value="Dessert">Dessert</option>
        <option value="Beverage">Beverage</option>
      </select>
      <button type="submit">Add Menu Item</button>
    </form>
  );
};

export default MenuItemForm;