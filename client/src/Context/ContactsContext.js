const { createContext, useState } = require('react');

const ContactsContext = createContext();

function ContactsProvider({ children }) {
  const [contacts, setContacts] = useState([]);

  const handleSetContacts = (value) => {
    setContacts(value);
  };

  const value = {
    contacts,
    handleSetContacts,
  };

  return <ContactsContext.Provider value={value}>{children}</ContactsContext.Provider>;
}

export { ContactsContext, ContactsProvider };
