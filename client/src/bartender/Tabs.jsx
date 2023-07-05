import React, { useState } from 'react';
import CustomerTab from './CustomerTab';
import './Tabs.css';
import PopUp from './PopUp';

function Tabs({ customers, searchTerm }) {

  const [selectedCustomer, setSelectedCustomer] = useState(null);

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

  const { positiveBalanceCustomers, zeroBalanceCustomers } = filterCustomers(customers, searchTerm);

  return (
  <div className="tabsWrapper">
    <ul className="tabsContainer">
      {positiveBalanceCustomers.map((customer) => (
        <li key={customer.id}>
          <CustomerTab customer={customer} setSelectedCustomer={setSelectedCustomer}/>
        </li>
      ))}
    </ul>
      {zeroBalanceCustomers.length > 0 && (
        <>
          <h2>No Outstanding Balance</h2>
          <ul className="tabsContainer">
              {zeroBalanceCustomers.map((customer) => (
                <li key={customer.id}>
                  <CustomerTab customer={customer} setSelectedCustomer={setSelectedCustomer}/>
                </li>
              ))}
          </ul>
        </>
      )}
    {selectedCustomer && (
      <PopUp
        customer={selectedCustomer}
        customers={customers}
        setSelectedCustomer = {setSelectedCustomer}
      />
    )}
  </div>
);
}

export default Tabs;