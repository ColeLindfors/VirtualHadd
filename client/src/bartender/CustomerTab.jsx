import React from 'react';
import './CustomerTab.css';
import { Link } from 'react-router-dom';
import { useAppState } from '../contexts/StateContext';

// TODO: Fix weird box shadow on the inline portion of customer
function CustomerTab({ customer, showPopUp }) {
  const { setState } = useAppState();

  const handleClickPerson = () => {
    showPopUp(customer, 'selector');
  };

  const handleClickCart = (event) => {
    event.stopPropagation();
    setState(prevState => ({ ...prevState, customer: customer }));
  };

  return (
    <div className="customerButton" onClick={handleClickPerson}>
      <h3 className="customerName"> {customer.first_name} {customer.last_name}</h3>

      <div className="customerDetails">
        <p className="customerTab">${customer.tab_balance.toFixed(2)}</p>
        <div onClick={handleClickCart}>
          <Link
            // onClick={(event) => event.stopPropagation()}
            to={{
              pathname: `/ordering/${customer.first_name}${customer.last_name}`,
            }}
          >
            <span className="material-symbols-outlined">
              shopping_cart
            </span>
          </Link>
        </div>
        
      </div>
    </div>
  );
}

export default CustomerTab;