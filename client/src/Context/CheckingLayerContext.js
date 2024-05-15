const { createContext, useState } = require('react');

const CheckingLayerContext = createContext();

function CheckingLayerProvider({ children }) {
  const [functionHandlers, setFunctionHandlers] = useState();

  const value = {
    functionHandlers,
    setFunctionHandlers,
  };

  return <CheckingLayerContext.Provider value={value}>{children}</CheckingLayerContext.Provider>;
}

export { CheckingLayerContext, CheckingLayerProvider };
