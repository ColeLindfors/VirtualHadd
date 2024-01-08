import React, { useState } from 'react';
import CustomerTab from './CustomerTab';
import './Tabs.css';
import PopUp from './popUps/PopUp';

function Tabs({ customers, searchTerm }) {

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [popUpType, setPopUpType] = useState(null);

  function filterCustomers(customers, searchTerm) {
    const positiveBalanceCustomers = [];
    const zeroBalanceCustomers = [];
  
    customers.forEach((customer) => {
      if (`${customer.firstName} ${customer.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())) {
        if (customer.tab > 0) {
          positiveBalanceCustomers.push(customer);
        } else {
          zeroBalanceCustomers.push(customer);
        }
      }
    });
    return { positiveBalanceCustomers, zeroBalanceCustomers };
  }
  
  /**
   * @param {Object} customer - The customer object (including their tab) to show in the popup
   * @param {String} popUpType - The type of popup to show, (default is null for no popup)
   */
  function showPopUp(customer, popUpType = null) {
    setSelectedCustomer(customer);
    setPopUpType(popUpType);
  }


  const { positiveBalanceCustomers, zeroBalanceCustomers } = filterCustomers(customers, searchTerm);

  return (
  <div className="tabsWrapper">
    <ul className="tabsContainer">
      {positiveBalanceCustomers.map((customer) => (
        <li key={customer.id}>
          <CustomerTab customer={customer} showPopUp={showPopUp}/>
        </li>
      ))}
    </ul>
      {zeroBalanceCustomers.length > 0 && (
        <>
          <h2>No Outstanding Balance</h2>
          <ul className="tabsContainer">
              {zeroBalanceCustomers.map((customer) => (
                <li key={customer.id}>
                  <CustomerTab customer={customer} showPopUp={showPopUp}/>
                </li>
              ))}
          </ul>
        </>
      )}
    {selectedCustomer && (
      <PopUp
        showPopUp={showPopUp}
        customer={selectedCustomer}
        popUpType = {popUpType}
      />
    )}
  </div>
);
}

export default Tabs;