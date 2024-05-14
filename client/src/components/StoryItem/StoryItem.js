import classNames from 'classnames/bind';
import styles from './StoryItem.module.scss';
import MediaItem2 from '../MediaItem2/MediaItem2';

const cx = classNames.bind(styles);

function StoryItem({ story_img, author_name, author_avatar, backgroundImage, className, onClick }) {
  return (
    <div className={cx('wrapper', { [className]: className })} onClick={onClick}>
      <div className={cx('bg-image')} style={{ backgroundImage: backgroundImage }}></div>
      <div className={cx('author-info')}>
        <MediaItem2
          item={{ url: author_avatar, type: 'image' }}
          width={40}
          height={40}
          border_radius={1000}
          _styles={{
            boxShadow: 'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px',
          }}
          className={cx('author-avatar')}
        />
        <p className={cx('author-name')}>{author_name}</p>
      </div>
    </div>
  );
}

export default StoryItem;
