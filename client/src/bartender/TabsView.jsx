import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../contexts/user.context';
import BartenderHeader from './BartenderHeader';
import SearchBar from '../menu/SearchBar';
import Tabs from './Tabs';
import './TabsView.css';

function TabsView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState([]);
  const { user } = useContext(UserContext);

  useEffect( () => {
    async function fetchTabs() {
      try {
        const allCustomers = await user.functions.getAllTabs();
        // map the database results to a more friendly format
        setCustomers(allCustomers
          .filter((customer) => customer.first_name !== 'guestFirstName')
          .map((customer) => ({
            id: customer._id.toString(),
            firstName: customer.first_name,
            lastName: customer.last_name,
            tab: parseFloat(customer.tab_balance),
        })));
      } catch (error) {
        console.error("Failed to fetch tabs: ", error);
      }
    }
    fetchTabs();
  }, [user]);

  useEffect(() => {
    async function maintainTabs() {
      // Connect to the database
      const collection = user.mongoClient("mongodb-atlas").db("VirtualHaddDB").collection("users");
      // Everytime a change happens in the stream, update the tab balance
      for await (const change of collection.watch()) {
        // * Possible optimization: keep track of the last change that occured and only update if the change is different
        if(change.operationType === 'update') {
          const changedCustomerId = change.fullDocument._id.toString();
          setCustomers(oldCustomers => {
            return (
              oldCustomers.map((customer) => {
                if (customer.id === changedCustomerId) {
                  customer.tab = parseFloat(change.fullDocument.tab_balance);
                }
                return customer;
              })
            );
          });
        }
      }
    }
    maintainTabs();
  }, [user]);

  return (
    <div className="tabsViewContainer">
      <BartenderHeader activeTab='tabs'/>
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        placeholder="Search for a Lodger..."
      />
      <Tabs customers={customers} searchTerm={searchTerm} />
    </div>
  );
}

export default TabsView;