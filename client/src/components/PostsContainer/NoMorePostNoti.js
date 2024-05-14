import classNames from 'classnames/bind';
import styles from './PostsContainer.module.scss';
import { EmptyIcon } from '../EmotionIcon/EmotionIcon';

const cx = classNames.bind(styles);

function NoMorePostNoti({ onOpenFriends }) {
  return (
    <div className={cx('empty-container')}>
      <EmptyIcon width="80px" height="80px" />
      <div className={cx('title-container')}>
        <h2 className={cx('empty-posts-title')}>Add Friends to see more posts</h2>
        <p>The more friends you add on Social., the more posts, photos and videos you'll see here</p>
      </div>
      <button className={cx('add-friends-btn')} onClick={onOpenFriends}>
        Add Friends
      </button>
    </div>
  );
}

export default NoMorePostNoti;
