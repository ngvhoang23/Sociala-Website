const { createContext, useState } = require('react');

const StoryPreviewContext = createContext();

function StoryPreviewProvider({ children }) {
  const [storyPreview, setStoryPreview] = useState();

  const value = {
    storyPreview,
    setStoryPreview,
  };

  return <StoryPreviewContext.Provider value={value}>{children}</StoryPreviewContext.Provider>;
}

export { StoryPreviewContext, StoryPreviewProvider };
