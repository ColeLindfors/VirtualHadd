import React, { useState } from 'react';
import Tabs from './Tabs';
import './BartenderView.css';
import SearchIcon from '@mui/icons-material/Search';

function BartenderView() {
  const [activeView, setActiveView] = useState('Tabs'); // add activeTab state variable
  const [searchTerm, setSearchTerm] = useState('');

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
      <Tabs searchTerm={searchTerm} />
    </div>
  );
}

export default BartenderView;