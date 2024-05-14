import classNames from 'classnames/bind';
import styles from './FriendRequestItem.module.scss';

const cx = classNames.bind(styles);

function FriendRequestItem() {
  return (
    <div className={cx('wrapper')}>
      <div className={cx('account-info')}>
        <img className={cx('account-avatar')} src="http://uitheme.net/sociala/images/user-7.png" alt="" />
        <div className={cx('')}>
          <p className={cx('account-name')}>Anthony Daugloi</p>
          <p className={cx('mutual-friends')}>12 mutual friends</p>
        </div>
      </div>
      <div className={cx('operations')}>
        <button className={cx('confirm-btn')}>Confirm</button>
        <button className={cx('reject-btn')}>Cancel</button>
      </div>
    </div>
  );
}

export default FriendRequestItem;
