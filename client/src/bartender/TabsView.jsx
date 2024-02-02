import React, { useState } from 'react';
import BartenderHeader from './BartenderHeader';
import SearchBar from '../menu/SearchBar';
import Tabs from './Tabs';
import './TabsView.css';

function TabsView({customers}) {
  const [searchTerm, setSearchTerm] = useState('');

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