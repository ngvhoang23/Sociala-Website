const { createContext, useState } = require('react');

const NeedToReLoadContext = createContext();

function NeedToReLoadProvider({ children }) {
  const [reLoadingSignal, setReLoadingSignal] = useState({ status: false });

  const value = {
    reLoadingSignal,
    setReLoadingSignal,
  };

  return <NeedToReLoadContext.Provider value={value}>{children}</NeedToReLoadContext.Provider>;
}

export { NeedToReLoadContext, NeedToReLoadProvider };
