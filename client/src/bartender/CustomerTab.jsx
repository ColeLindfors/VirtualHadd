import React from 'react';
import { useState } from 'react';
import './CustomerTab.css';
import SportsBarIcon from '@mui/icons-material/SportsBar';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

function CustomerTab({ customer }) {
  const [showInputBox, setShowInputBox] = useState(false);


  const handleAddToTab = () => {
    const amount = prompt('Enter amount to add to tab:', 0);
    // TODO: Add amount to customer tab
  };

  const handleClose = () => {
    setShowInputBox(false);
  };

  const handleViewDrinks = () => {
    // TODO: Navigate to drinks view for customer
  };

  return (
    <div className="customerContainer">
      <h3 className="customerName"> {customer.firstName} {customer.lastName}</h3>

      <div className="customerDetails">
        <p className="customerTab">${customer.tab.toFixed(2)}</p>
        <div className="customerIconsContainer">
          <SportsBarIcon
            className="beerIcon"
            onClick={handleAddToTab}
          />
          <AddCircleOutlineIcon
            className="addIcon"
            onClick={handleViewDrinks}
          />
        </div> 
      </div>
    </div>
  );
}

export default CustomerTab;