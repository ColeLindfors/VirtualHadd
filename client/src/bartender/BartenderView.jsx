import React, { useState, useEffect } from 'react';
import * as Realm from 'realm-web';
import Tabs from './Tabs';
import './BartenderView.css';
import SearchIcon from '@mui/icons-material/Search';

function BartenderView() {

  const [activeView, setActiveView] = useState('Tabs');
  const [searchTerm, setSearchTerm] = useState('');

  // TODO: ALL THIS MUST BE ABSTRACTED TO A SPEPARATE LOGIN SECTION, THIS IS JUST FOR TESTING
  const [customers, setCustomers] = useState([]);
  useEffect( () => {
    async function loginAndFetchTabs() {
      console.log("loginAndFetchTabs ran");
      const REALM_APP_ID = "application-0-gydmq";
      const app = new Realm.App({ id: REALM_APP_ID });
      const credentials = Realm.Credentials.function({
        username: "ColeLindfors",
        password: "defaultpassword"
      });
      try {
        const user = await app.logIn(credentials);
        console.log(app.currentUser);
        const allCustomers = await user.functions.getAllTabs();
        // map the database results to a more friendly format
        setCustomers(allCustomers.map((customer) => ({
          id: customer._id.toString(),
          firstName: customer.first_name,
          lastName: customer.last_name,
          tab: parseFloat(customer.tab_balance),
        })));
      } catch (error) {
        console.error("Failed to log in", error);
      }
    }
    loginAndFetchTabs();
  }, []);

  useEffect(() => {
    async function maintainTabs() {
      console.log("maintainTabs ran");
      const REALM_APP_ID = "application-0-gydmq";
      const app = new Realm.App({ id: REALM_APP_ID });
      // ! MUST INSERT A TRY BLOCK HERE TOO
      // Connect to the database
      const  mongodb = app.currentUser.mongoClient("mongodb-atlas");
      const  collection = mongodb.db("VirtualHaddDB").collection("users");
      
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
  }, []);



  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  //function to handle header click, setting active tab to the tab that was clicked
  const handleHeaderClick = (event) => {
    setActiveView(event.target.innerHTML);
    console.log("setActiveView: ", activeView);
  };

  const handleSearchBarClick = () => {
    const input = document.querySelector('.searchBar input');
    input.focus();
  };

  return (
    <div className="bartenderViewContainer">
      <div className="headers">
        <h1 
          onClick={handleHeaderClick} 
          className={activeView === 'Orders' ? 'active' : ''}
        >
          Orders
        </h1>
        <h1 
          onClick={handleHeaderClick} 
          className={activeView === 'Tabs' ? 'active' : ''}
        >
          Tabs
        </h1>
      </div>
      <div className="searchBar" onClick={handleSearchBarClick}>
        <SearchIcon 
          className="searchIcon"
          sx={{fontSize: 30}} 
        />
        <input
          type="text"
          autoCorrect="off"
          value={searchTerm} 
          onChange={handleSearch}
          placeholder="Search for a Lodger..."
        />
      </div>
      <Tabs customers={customers} searchTerm={searchTerm} />
    </div>
  );
}

export default BartenderView;