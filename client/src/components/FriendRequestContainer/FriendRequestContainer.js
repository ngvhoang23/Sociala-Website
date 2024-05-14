import classNames from 'classnames/bind';
import styles from './FriendRequestContainer.module.scss';
import FriendRequestItem from '../FriendRequestItem';

const cx = classNames.bind(styles);

function FriendRequestContainer({ className }) {
  return (
    <div className={cx('wrapper', { [className]: className })}>
      <div className={cx('header')}>
        <p className={cx('header-title')}>Friend Requests</p>
        <button className={cx('see-all-btn')}>See all</button>
      </div>
      <div className={cx('body')}>
        <FriendRequestItem />
        <FriendRequestItem />
        <FriendRequestItem />
      </div>
    </div>
  );
}

export default FriendRequestContainer;
