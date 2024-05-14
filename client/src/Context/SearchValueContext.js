const { createContext, useState } = require('react');

const SearchResultContext = createContext();

function SearchResultProvider({ children }) {
  const [searchResults, setSearchResults] = useState('');

  const handleSearchUsers = (value) => {
    setSearchResults(value);
  };

  const value = {
    searchResults,
    handleSearchUsers,
  };

  return <SearchResultContext.Provider value={value}>{children}</SearchResultContext.Provider>;
}

export { SearchResultContext, SearchResultProvider };
