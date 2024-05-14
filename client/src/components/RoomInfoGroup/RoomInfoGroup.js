import classNames from 'classnames/bind';
import { memo, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import { InfoIcon } from '../Icons';
import styles from './RoomInfoGroup.module.scss';

const cx = classNames.bind(styles);

function RoomInfoGroup({ className, children, icon, title, onClick }) {
  const [isShowContent, setIsShowContent] = useState(false);

  return (
    <div className={cx('wrapper', { [className]: className })} onClick={onClick}>
      <div className={cx('header')} onClick={() => setIsShowContent((prev) => !prev)}>
        <h6 className={cx('header-title')}>{title}</h6>
        <span>{icon}</span>
      </div>
      {isShowContent && <div className={cx('content')}>{children}</div>}
    </div>
  );
}

export default memo(RoomInfoGroup);
