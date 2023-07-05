import React, { useState, useEffect } from 'react';
import * as Realm from 'realm-web';
import Tabs from './Tabs';
import './BartenderView.css';
import SearchIcon from '@mui/icons-material/Search';
import PopUp from './PopUp';

function BartenderView() {

  const [activeView, setActiveView] = useState('Tabs');
  const [searchTerm, setSearchTerm] = useState('');
  // const [customers, setCustomers] = React.useState([
  //   { id: 1, firstName: 'Oliver', lastName: 'Clothesoff', tab: 6.0 },
  //   { id: 2, firstName: 'Jack', lastName: 'Goff', tab: 10.0 },
  //   { id: 3, firstName: 'Craven', lastName: 'MooreheadEveryDay', tab: 3.5 },
  //   { id: 5, firstName: 'Fonda', lastName: 'Dicks', tab: 7.0 },
  //   { id: 6, firstName: 'Ben', lastName: 'Dover', tab: 12.0 },
  //   { id: 7, firstName: 'Hugh', lastName: 'Janus', tab: 6.0 },
  //   { id: 8, firstName: 'Mike', lastName: 'Hock', tab: 9.5 },
  //   { id: 9, firstName: 'Seymour', lastName: 'Butts', tab: 1.0 },
  //   { id: 10, firstName: 'Barry', lastName: 'McCockiner', tab: 20.37 },
  //   { id: 11, firstName: 'Heywood', lastName: 'U. Cuddleme', tab: 1.0 },
  //   { id: 12, firstName: 'Harry', lastName: 'Baals', tab: 0.5 },
  // ]);

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