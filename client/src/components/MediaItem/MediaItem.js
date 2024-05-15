import classNames from 'classnames/bind';
import styles from './MediaItem.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import { CloseIcon } from '../Icons';
import { memo } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';

const cx = classNames.bind(styles);

function MediaItem({ type, src, onRemove, removable, large, small, medium, className, mini, onClick, bg_text }) {
  const renderMedia = () => {
    if (type == 'image') {
      return <img className={cx('media-item')} alt="" src={src} />;
    } else if (type == 'video') {
      return (
        <video className={cx('media-item', 'video-item')} controls muted>
          <source src={src} type="video/mp4" />
          Something wents wrong!
        </video>
      );
    } else {
      return <></>;
    }
  };

  return (
    <div
      className={cx(
        'wrapper',
        { [className]: className },
        { large: large },
        { small: small },
        { medium: medium },
        { mini: mini },
      )}
      onClick={onClick}
    >
      {removable && onRemove && (
        <button
          className={cx('remove-btn')}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <CloseIcon width="2rem" height="2rem" />
        </button>
      )}
      <span className={cx('media-wrapper')}>
        {renderMedia()}
        {bg_text && <div className={cx('bg-text')}>+3</div>}
      </span>
    </div>
  );
}

export default memo(MediaItem);
