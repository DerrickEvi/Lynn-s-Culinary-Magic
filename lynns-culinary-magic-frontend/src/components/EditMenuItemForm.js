import React, { useState, useEffect } from "react";
import axios from "axios";

const EditMenuItemForm = ({ item, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: item.name,
    description: item.description,
    price: item.price,
    category: item.category,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5020/api/menu-items/${item._id}`, formData);
      onSave();
    } catch (error) {
      console.error("Error updating menu item:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="edit-name">Name:</label>
        <input
          type="text"
          id="edit-name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="edit-description">Description:</label>
        <textarea
          id="edit-description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="edit-price">Price:</label>
        <input
          type="number"
          id="edit-price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="edit-category">Category:</label>
        <select
          id="edit-category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select a category</option>
          <option value="Appetizer">Appetizer</option>
          <option value="Main Course">Main Course</option>
          <option value="Dessert">Dessert</option>
          <option value="Beverage">Beverage</option>
        </select>
      </div>
      <button type="submit">Save Changes</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
};

const MenuItemsList = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get("http://localhost:5020/api/menu-items");
      setMenuItems(response.data.data);
      setLoading(false);
    } catch (error) {
      setError("Error fetching menu items. Please try again later.");
      setLoading(false);
    }
  };

  const deleteMenuItem = async (id) => {
    try {
      await axios.delete(`http://localhost:5020/api/menu-items/${id}`);
      setMenuItems(menuItems.filter(item => item._id !== id));
    } catch (error) {
      setError("Error deleting menu item. Please try again.");
    }
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
  };

  const handleSaveEdit = () => {
    setEditingItem(null);
    fetchMenuItems();
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="menu-items-list">
      <h2>Menu Items</h2>
      {menuItems.length === 0 ? (
        <p>No menu items found.</p>
      ) : (
        <ul>
          {menuItems.map((item) => (
            <li key={item._id}>
              {editingItem && editingItem._id === item._id ? (
                <EditMenuItemForm 
                  item={item} 
                  onSave={handleSaveEdit}
                  onCancel={() => setEditingItem(null)}
                />
              ) : (
                <>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <p>Price: ${item.price}</p>
                  <p>Category: {item.category}</p>
                  <button onClick={() => deleteMenuItem(item._id)}>Delete</button>
                  <button onClick={() => handleEditClick(item)}>Edit</button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MenuItemsList;