import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../contexts/user.context';
import BartenderHeader from './BartenderHeader';
import SearchBar from '../menu/SearchBar';
import Tabs from './Tabs';
import './TabsView.css';

function TabsView( {customers, setCustomers}) {
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useContext(UserContext);

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
        let lastChangeId = null; // we only want to update if the change is a new change
        for await (const change of changeStream) {
          // TODO: finish repeat change optimization, still not great
          if (String(change._id) === String(lastChangeId)) {
            console.log('change already handled');
            continue;
          }
          lastChangeId = change._id;
          if(change.operationType === 'update') {
            const changedCustomerId = change.fullDocument._id.toString();
            setCustomers(oldCustomers => {
              const newCustomers = oldCustomers.map((customer) => {
                if (customer._id === changedCustomerId) {
                  customer.tab_balance = parseFloat(change.fullDocument.tab_balance);
                  customer.venmo = change.fullDocument.venmo;
                }
                return customer;
              });
              return newCustomers;
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
  }, [user, setCustomers]);

  return (
    <div className="tabsViewContainer">
      <div className="gray-header-background">
        <BartenderHeader activeTab='tabs'/>
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholder="Search for a Lodger..."
        />
      </div>
      <Tabs customers={customers} searchTerm={searchTerm} />
    </div>
  );
}

export default TabsView;