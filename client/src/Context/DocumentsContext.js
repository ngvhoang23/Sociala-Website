const { createContext, useState } = require('react');

const DocumentsContext = createContext();

function DocumentsProvider({ children }) {
  const [documents, setDocuments] = useState([]);

  const value = {
    documents,
    setDocuments,
  };

  return <DocumentsContext.Provider value={value}>{children}</DocumentsContext.Provider>;
}

export { DocumentsContext, DocumentsProvider };
