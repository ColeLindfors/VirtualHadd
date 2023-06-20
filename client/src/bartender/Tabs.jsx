import React from 'react';
import CustomerTab from './CustomerTab';
import './Tabs.css';

function Tabs({ searchTerm }) {
  const customers = [
    { id: 1, firstName: 'Oliver', lastName: 'Clothesoff', tab: 6.0 },
    { id: 2, firstName: 'Jack', lastName: 'Goff', tab: 10.0 },
    { id: 3, firstName: 'Craven', lastName: 'MooreheadEveryDay', tab: 3.5 },
    { id: 5, firstName: 'Fonda', lastName: 'Dicks', tab: 7.0 },
    { id: 6, firstName: 'Ben', lastName: 'Dover', tab: 12.0 },
    { id: 7, firstName: 'Hugh', lastName: 'Janus', tab: 6.0 },
    { id: 8, firstName: 'Mike', lastName: 'Hock', tab: 9.5 },
    { id: 9, firstName: 'Seymour', lastName: 'Butts', tab: 1.0 },
    { id: 10, firstName: 'Barry', lastName: 'McCockiner', tab: 20.37 },
    { id: 11, firstName: 'Heywood', lastName: 'U. Cuddleme', tab: 1.0 },
    { id: 12, firstName: 'Harry', lastName: 'Baals', tab: 0.5 },
    
  ];



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
            <CustomerTab customer={customer} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Tabs;