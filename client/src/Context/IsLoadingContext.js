const { createContext, useState } = require('react');

const IsLoadingContext = createContext();

function IsLoadingProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);

  const value = {
    isLoading,
    setIsLoading,
  };

  return <IsLoadingContext.Provider value={value}>{children}</IsLoadingContext.Provider>;
}

export { IsLoadingContext, IsLoadingProvider };
