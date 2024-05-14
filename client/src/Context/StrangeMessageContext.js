const { createContext, useState } = require('react');

const StrangeMessageContext = createContext();

function StrangeMessageProvider({ children }) {
  const [isStrange, setIsStrange] = useState([]);

  const handleSetIsStrange = (value) => {
    setIsStrange(value);
  };

  const value = {
    isStrange,
    handleSetIsStrange,
  };

  return <StrangeMessageContext.Provider value={value}>{children}</StrangeMessageContext.Provider>;
}

export { StrangeMessageContext, StrangeMessageProvider };
