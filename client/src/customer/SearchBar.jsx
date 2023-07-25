import './SearchBar.css';

function SearchBar ({setSearchTerm, searchTerm, placeholder}) {
  
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchBarClick = () => {
    const input = document.querySelector('.searchBar input');
    input.focus();
  };

	function handleKeyDown(event) {
    // handle go button click from the search keyboard
    if (event.key === 'Enter') {
      event.preventDefault();
      event.target.blur();
    }
	};

  return (
    <div className="searchBar" onClick={handleSearchBarClick}>
        <span className="material-symbols-outlined searchIcon">search</span>
        <input
          type="search"
          inputMode="search"
          autoCorrect="off"
          value={searchTerm} 
          onChange={handleSearch}
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
        />
      </div>
  )
};

export default SearchBar;