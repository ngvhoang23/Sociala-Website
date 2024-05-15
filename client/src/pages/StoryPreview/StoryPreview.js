import classNames from 'classnames/bind';
import styles from './StoryPreview.module.scss';
import { CloseIcon } from '~/components/Icons';
import StoryPreviewModal from '~/components/StoryPreviewModal';
import { useContext, useEffect } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import { StoryPreviewContext } from '~/Context/StoryPreviewContext';

const cx = classNames.bind(styles);

function StoryPreview({ index, storyData, story_list, onClick }) {
  // USE_CONTEXT
  const storyPreviewContext = useContext(StoryPreviewContext);
  const storyPreview = storyPreviewContext.storyPreview;
  const setStoryPreview = storyPreviewContext.setStoryPreview;

  useEffect(() => {
    // DISABLE SCROLL BAR
    const rootElement = document.getElementById('root');
    rootElement.style.overflow = 'hidden';
  }, []);

  return (
    <div className={cx('wrapper')}>
      <button
        className={cx('close-btn')}
        onClick={() => {
          // ENABLE SCROLL BAR
          const rootElement = document.getElementById('root');
          rootElement.style.overflow = 'unset';
          setStoryPreview();
        }}
      >
        <CloseIcon width={'2.8rem'} height={'2.8rem'} />
      </button>
      <StoryPreviewModal
        index={storyPreview?.index}
        author_id={storyPreview?.author_id}
        story_list={storyPreview?.story_list}
        storyData={storyPreview?.storyData}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

export default StoryPreview;
