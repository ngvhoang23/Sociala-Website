const { createContext, useState } = require('react');

const IsOpenStoryGeneratorContext = createContext();

function IsOpenStoryGeneratorProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const value = {
    isOpen,
    setIsOpen,
  };

  return <IsOpenStoryGeneratorContext.Provider value={value}>{children}</IsOpenStoryGeneratorContext.Provider>;
}

export { IsOpenStoryGeneratorContext, IsOpenStoryGeneratorProvider };
