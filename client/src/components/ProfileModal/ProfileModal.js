import { Navigate, useNavigate } from 'react-router-dom';

import classNames from 'classnames/bind';
import GroupInfoItem from '~/pages/SettingDashboard/GroupInfoItem';
import IconBtn from '../IconBtn';
import { ClockIcon, MessageDot, PhoneIcon } from '../Icons';
import styles from './ProfileModal.module.scss';

const cx = classNames.bind(styles);

function ProfileModal({ children, className, user_name, user_avatar, options }) {
  const navigate = useNavigate();

  return (
    <div className={cx('wrapper', { [className]: className })}>
      <div className={cx('header')}>
        <div className={cx('avatar')}>
          <img src={user_avatar} alt="avatar" />
        </div>
        <div className={cx('user-name')}>{user_name}</div>
        {options && <div className={cx('options')}>{options}</div>}
      </div>
      <div className={cx('content')}>{children}</div>
    </div>
  );
}

export default ProfileModal;
