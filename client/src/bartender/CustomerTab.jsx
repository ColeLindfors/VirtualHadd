import React from 'react';
import './CustomerTab.css';
import SportsBarIcon from '@mui/icons-material/SportsBar';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

function CustomerTab({ customer }) {


  const handleAddToTab = () => {
    const amount = prompt('Enter amount to add to tab:');
    // TODO: Add amount to customer tab
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
            sx={{fontSize: 30}}
          />
          <AddCircleOutlineIcon
            className="addIcon"
            onClick={handleViewDrinks}
            sx={{fontSize: 30}}
          />
        </div> 
      </div>
    </div>
  );
}

export default CustomerTab;