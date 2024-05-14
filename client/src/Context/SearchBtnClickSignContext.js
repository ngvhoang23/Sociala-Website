const { createContext, useState } = require('react');

const SearchBtnClickSignContext = createContext();

function SearchBtnClickSignProvider({ children }) {
  const [clickSign, setClickSign] = useState(false);

  const value = {
    clickSign,
    setClickSign,
  };

  return <SearchBtnClickSignContext.Provider value={value}>{children}</SearchBtnClickSignContext.Provider>;
}

export { SearchBtnClickSignContext, SearchBtnClickSignProvider };
