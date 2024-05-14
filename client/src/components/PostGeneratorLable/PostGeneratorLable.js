import classNames from 'classnames/bind';
import styles from './PostGeneratorLable.module.scss';
import Cookies from 'universal-cookie';
import { DocumentIcon, PhoneIcon, PhotoIcon } from '../Icons';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import { useContext } from 'react';
import MediaItem2 from '../MediaItem2/MediaItem2';
import { type } from '@testing-library/user-event/dist/type';

const cx = classNames.bind(styles);
const cookies = new Cookies();

function PostGeneratorLable({ className, onOpenPostGenerator }) {
  const userInfoContext = useContext(UserInfoContext);
  const user = userInfoContext.user;

  return (
    <div className={cx('wrapper', { [className]: className })}>
      <div className={cx('container')}>
        <MediaItem2
          item={{ url: user.user_avatar, type: 'image' }}
          width={40}
          height={40}
          border_radius={10000}
          _styles={{
            boxShadow: 'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px',
          }}
          className={cx('user-avatar')}
        />
        <div className={cx('lable-title')} onClick={onOpenPostGenerator}>
          What is in your mind, {user.full_name}
        </div>
      </div>
      <div className={cx('options-container')}>
        <button className={cx('photo-btn')} onClick={onOpenPostGenerator}>
          <PhotoIcon className={cx('photo-icon')} />
          <p className={cx('btn-title')}>Photo/Video</p>
        </button>
        <button className={cx('document-btn')} onClick={onOpenPostGenerator}>
          <DocumentIcon className={cx('document-icon')} />
          <p className={cx('btn-title')}>Attached files</p>
        </button>
      </div>
    </div>
  );
}

export default PostGeneratorLable;
