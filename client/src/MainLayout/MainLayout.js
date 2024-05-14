import { useContext } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import classNames from 'classnames/bind';
import styles from './MainLayout.module.scss';

import MainNavigation from './components/MainNavigation';
import { MediaProvider } from '~/Context/MediaContext';
import { DocumentsProvider } from '~/Context/DocumentsContext';
import { IsOpenNotificationContext } from '~/Context/IsOpenNotificationContext';
import NotificationTab from '~/components/NotificationTab/NotificationTab';

const cx = classNames.bind(styles);

function MainLayout({ children }) {
  const isOpenNotificationContext = useContext(IsOpenNotificationContext);
  const isOpenNotification = isOpenNotificationContext.isOpenNotification;
  const setIsOpenNotification = isOpenNotificationContext.setIsOpenNotification;

  const userInfoContext = useContext(UserInfoContext);
  const user = userInfoContext.user;

  return (
    <div className={cx('wrapper')}>
      <div className={cx('side-bar-left')}>
        <MainNavigation />
      </div>

      <div className={cx('container')}>{children}</div>
    </div>
  );
}

export default MainLayout;
