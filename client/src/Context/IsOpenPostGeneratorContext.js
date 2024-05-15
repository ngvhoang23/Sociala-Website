const { createContext, useState } = require('react');

const IsOpenPostGeneratorContext = createContext();

function IsOpenPostGeneratorProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const value = {
    isOpen,
    setIsOpen,
  };

  return <IsOpenPostGeneratorContext.Provider value={value}>{children}</IsOpenPostGeneratorContext.Provider>;
}

export { IsOpenPostGeneratorContext, IsOpenPostGeneratorProvider };
