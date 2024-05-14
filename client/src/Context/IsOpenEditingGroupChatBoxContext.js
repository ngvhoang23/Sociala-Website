const { createContext, useState } = require('react');

const IsOpenEditingGroupChatBoxContext = createContext();

function IsOpenEditingGroupChatBoxProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const value = {
    isOpen,
    setIsOpen,
  };

  return (
    <IsOpenEditingGroupChatBoxContext.Provider value={value}>{children}</IsOpenEditingGroupChatBoxContext.Provider>
  );
}

export { IsOpenEditingGroupChatBoxContext, IsOpenEditingGroupChatBoxProvider };
