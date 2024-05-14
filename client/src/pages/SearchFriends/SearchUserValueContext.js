const { createContext, useState } = require('react');

const SearchUserValueContext = createContext();

function SearchUserValueProvider({ children }) {
  const [searchValue, setSearchValue] = useState('');

  const value = {
    searchValue,
    setSearchValue,
  };

  return <SearchUserValueContext.Provider value={value}>{children}</SearchUserValueContext.Provider>;
}

export { SearchUserValueContext, SearchUserValueProvider };
