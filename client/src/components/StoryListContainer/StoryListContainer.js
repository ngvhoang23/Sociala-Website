import classNames from 'classnames/bind';
import styles from './StoryListContainer.module.scss';
import OnlineContactItem from '../OnlineContactItem';
import { memo, useContext } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';

const cx = classNames.bind(styles);

function StoryListContainer({
  seen_story_data,
  current_author_id,
  setCurrentStoryInd,
  stories,
  setCurrentStoryCollection,
}) {
  const userInfoContext = useContext(UserInfoContext);
  const user = userInfoContext.user;

  // FUNCTION_HANDLER
  const handleOpenStoryModal = (story, index) => {
    setCurrentStoryCollection(story);
    setCurrentStoryInd(index);
  };

  const renderStories = () => {
    return stories.map((story, index) => {
      let quantity = 0;
      story?.forEach((item) => {
        if (
          !seen_story_data?.some((seen_story) => {
            return seen_story.story_id == item.story_id;
          })
        ) {
          quantity++;
        }
      });

      return (
        <OnlineContactItem
          className={cx('story-item', { active: story[0].author_id == current_author_id })}
          key={story[0].author_id}
          contact_name={story[0].author_full_name}
          contact_avatar={story[0].author_avatar}
          des_timestamp={story[0].created_at}
          large
          description={`${story[0].author_id == user.user_id ? `${story.length} stories` : `${quantity} new`}`}
          avatar_border
          active={quantity > 0 || story[0].author_id == user.user_id}
          onClick={() => handleOpenStoryModal(story, index)}
          avatar_width={60}
          avatar_height={60}
        />
      );
    });
  };

  return (
    <div
      className={cx('wrapper')}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <h2 className={cx('header')}>Stories</h2>
      <div className={cx('body')}>{renderStories()}</div>
    </div>
  );
}

export default memo(StoryListContainer);
