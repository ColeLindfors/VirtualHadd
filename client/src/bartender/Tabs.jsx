import React, { useState } from 'react';
import CustomerTab from './CustomerTab';
import './Tabs.css';
import PopUp from './PopUp';

function Tabs({ customers, searchTerm }) {

  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const filteredCustomers = customers.filter((customer) =>
    `${customer.firstName} ${customer.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <ul className="tabsContainer">
        {filteredCustomers.map((customer) => (
          <li key={customer.id}>
            <CustomerTab customer={customer} setSelectedCustomer={setSelectedCustomer}/>
          </li>
        ))}
      </ul>
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