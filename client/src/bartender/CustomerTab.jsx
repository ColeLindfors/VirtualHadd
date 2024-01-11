import React from 'react';
import './CustomerTab.css';

// TODO: Fix weird box shadow on the inline portion of customer
function CustomerTab({ customer, showPopUp }) {

  const handleClickPerson = () => {
    showPopUp(customer, 'selector');
  };

  const handleClickCart = (event) => {
    event.stopPropagation();
    alert('Not implemented yet!');
  };

  return (
    <div className="customerButton" onClick={handleClickPerson}>
      <h3 className="customerName"> {customer.firstName} {customer.lastName}</h3>

      <div className="customerDetails">
        <p className="customerTab">${customer.tab.toFixed(2)}</p>
          <span className="material-symbols-outlined" onClick={handleClickCart}>
            shopping_cart
          </span>
      </div>
    </div>
  );
}

export default CustomerTab;