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
            venmo: customer.venmo,
        })));
      } catch (error) {
        console.error("Failed to fetch tabs: ", error);
      }
    }
    fetchTabs();
  }, [user]);

  useEffect(() => {
    let isMaintainTabsRunning = false;
    let client; // Store the client instance for reconnection
    let changeStream; // Store the change stream for closure
  
    async function maintainTabs() {
      isMaintainTabsRunning = true;
  
      try {
        if (!client) {
          client = user.mongoClient("mongodb-atlas"); // Create client if needed
        }
  
        const collection = client.db("VirtualHaddDB").collection("users");
        changeStream = collection.watch(); // Start change stream
  
        for await (const change of changeStream) {
          // * Possible optimization: keep track of the last change that occured and only update if the change is different
          if(change.operationType === 'update') {
            const changedCustomerId = change.fullDocument._id.toString();
            setCustomers(oldCustomers => {
              return (
                oldCustomers.map((customer) => {
                  if (customer.id === changedCustomerId) {
                    customer.tab = parseFloat(change.fullDocument.tab_balance);
                    customer.venmo = change.fullDocument.venmo;
                  }
                  return customer;
                })
              );
            });
          }
        }
      } catch (error) {
        // Handle errors (including WebSocket errors)
        console.error('Error maintaining tabs:', error);
        reconnect(); // Attempt reconnection
      } finally {
        isMaintainTabsRunning = false;
      }
    }
  
    async function reconnect() {
      // Retry connection after a delay
      console.log('Retrying connection...');
      await new Promise(resolve => setTimeout(resolve, 2000)); // Adjust delay as needed
      maintainTabs(); // Restart the process
    }
  
    if (!isMaintainTabsRunning) {
      maintainTabs();
    }
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