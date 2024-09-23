import React, { useState } from "react";
import MenuItemsList from "../components/MenuItemsList";
import MenuItemForm from "../components/MenuItemForm";

const MenuManagement = () => {
  const [refreshList, setRefreshList] = useState(false);

  const handleItemAdded = () => {
    setRefreshList(!refreshList);
  };

  return (
    <div className="menu-management">
      <h1>Menu Management</h1>
      <MenuItemForm onItemAdded={handleItemAdded} />
      <MenuItemsList key={refreshList} />
    </div>
  );
};

export default MenuManagement;