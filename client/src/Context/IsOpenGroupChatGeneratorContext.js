const { createContext, useState } = require('react');

const IsOpenGroupChatGeneratorContext = createContext();

function IsOpenGroupChatGeneratorProvider({ children }) {
  const [isOpenGroupChatGenerator, setIsOpenGroupChatGenerator] = useState(false);

  const value = {
    isOpenGroupChatGenerator,
    setIsOpenGroupChatGenerator,
  };

  return <IsOpenGroupChatGeneratorContext.Provider value={value}>{children}</IsOpenGroupChatGeneratorContext.Provider>;
}

export { IsOpenGroupChatGeneratorContext, IsOpenGroupChatGeneratorProvider };
