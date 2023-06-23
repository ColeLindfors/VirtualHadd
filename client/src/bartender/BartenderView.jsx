import React, { useState } from 'react';
import Tabs from './Tabs';
import './BartenderView.css';
import SearchIcon from '@mui/icons-material/Search';
import PopUp from './PopUp';

function BartenderView() {
  const [activeView, setActiveView] = useState('Tabs'); // add activeTab state variable
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = React.useState([
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
  ]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  //function to handle header click, setting active tab to the tab that was clicked
  const handleHeaderClick = (event) => {
    setActiveView(event.target.innerHTML);
    console.log("setActiveView: ", activeView);
  };

  // const handleHeaderClick = (tab) => {
  //   setActiveView(tab.innerHTML);
  //   console.log("setActiveView: ", tab.innerHTML);
  // };

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