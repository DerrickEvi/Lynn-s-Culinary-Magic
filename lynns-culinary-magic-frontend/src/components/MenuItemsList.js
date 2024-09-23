import React, { useState, useEffect } from "react";
import axios from "axios";
import EditMenuItemForm from "./EditMenuItemForm";

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