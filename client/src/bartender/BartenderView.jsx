import React, { useState } from 'react';
import Tabs from './Tabs';
import './BartenderView.css';
import SearchIcon from '@mui/icons-material/Search';

function BartenderView() {
  const [activeView, setActiveView] = useState('tabs'); // add activeTab state variable
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchIconClick = () => {
    const input = document.querySelector('.searchBar input');
    input.focus();
  };

  const handleHeaderClick = (tab) => {
    setActiveView(tab);
  };

  return (
    <div className="bartenderViewContainer">
      <div className="headers">
        <h1 className={activeView === 'orders' ? 'active' : ''}>Orders</h1>
        <h1 className={activeView === 'tabs' ? 'active' : ''}>Tabs</h1>
      </div>
      <div className="searchBar">
        <SearchIcon 
          onClick={handleSearchIconClick}
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