import React, { useState } from 'react';
import './PopUp.css';

function PopUp({ customer, customers, setSelectedCustomer }) {
  const [amount, setAmount] = useState(0);
  // TODO: implement handleAddToTab
  function handleAddToTab() {}

  const endsWithS = customer.firstName[customer.firstName.length - 1] === 's';

  return (
    <div className="overlay">
      <div className="popupContainer">
        <div className="popupInnerContainer">
          <h1>Add</h1>
          <div className="popupInputContainer">
            <input 
              inputMode="decimal" 
              placeholder="$0.00" 
              type="text"
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <h1> To {customer.firstName}{endsWithS ? "'" : "'s"}</h1>
          <h1>Tab</h1>
        </div>
        <div className="popupButtonsContainer">
          <h3 onClick={() => setSelectedCustomer(null)}>Cancel</h3>
          <h3 className="OK" onClick={() => handleAddToTab()}>OK</h3>
        </div>
      </div>
    </div>
  );
}

export default PopUp;
