const { createContext, useState } = require('react');

const IsOpenAddingGroupChatMembersBoxContext = createContext();

function IsOpenAddingGroupChatMembersBoxProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const value = {
    isOpen,
    setIsOpen,
  };

  return (
    <IsOpenAddingGroupChatMembersBoxContext.Provider value={value}>
      {children}
    </IsOpenAddingGroupChatMembersBoxContext.Provider>
  );
}

export { IsOpenAddingGroupChatMembersBoxContext, IsOpenAddingGroupChatMembersBoxProvider };
