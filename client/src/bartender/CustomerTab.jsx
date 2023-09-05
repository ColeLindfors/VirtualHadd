import React from 'react';
import './CustomerTab.css';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

function CustomerTab({ customer, showPopUp }) {

  const handleAddToTab = () => {
    showPopUp(customer, 'add');
  };

  const handleRemoveFromTab = () => {
    showPopUp(customer, 'remove');
  };

  return (
    <div className="customerContainer">
      <h3 className="customerName"> {customer.firstName} {customer.lastName}</h3>

      <div className="customerDetails">
        <p className="customerTab">${customer.tab.toFixed(2)}</p>
        <div className="customerIconsContainer">
          <AddIcon
            className="addIcon"
            onClick={handleAddToTab}
          />
          <RemoveIcon
            className="removeIcon"
            onClick={handleRemoveFromTab}
          />
        </div> 
      </div>
    </div>
  );
}

export default CustomerTab;