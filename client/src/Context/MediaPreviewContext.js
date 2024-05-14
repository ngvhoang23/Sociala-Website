const { createContext, useState } = require('react');

const MediaPreviewContext = createContext();

function MediaPreviewProvider({ children }) {
  const [mediaPreview, setMediaPreview] = useState();

  const value = {
    mediaPreview,
    setMediaPreview,
  };

  return <MediaPreviewContext.Provider value={value}>{children}</MediaPreviewContext.Provider>;
}

export { MediaPreviewContext, MediaPreviewProvider };
