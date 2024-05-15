import classNames from 'classnames/bind';
import styles from './NotificationTab.module.scss';
import AccountItem from '../AccountItem/AccountItem';
import { useContext, useEffect, useRef, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import { NotificationsContext } from '~/Context/NotificationsContext';
import moment from 'moment';
import Cookies from 'universal-cookie';
import axios from 'axios';
import NotificationItem from './components/NotificationItem/NotificationItem';
import { GearIcon, MessageDot, ThreeDotIcon, TickIcon, XMarkIcon } from '../Icons';
import TippyWrapper from '../TippyWrapper';
import IconBtn from '../IconBtn';
import { AxiosInstanceContext } from '../AxiosInterceptorWrapper/AxiosInterceptorWrapper';

const cookies = new Cookies();

const cx = classNames.bind(styles);

function NotificationTab() {
  // USE_CONTEXT
  const notificationsContext = useContext(NotificationsContext);
  const notifications = notificationsContext.notifications;
  const setNotifications = notificationsContext.setNotifications;

  const axiosInstanceContext = useContext(AxiosInstanceContext);
  const axiosInstance = axiosInstanceContext;

  // USE_STATE
  const [isOpenNotiItemOptions, setIsOpenNotiItemOptions] = useState(false);
  const [isOpenOptionBtn, setIsOpenOptionBtn] = useState(false);
  const [isOpenOptions, setIsOpenOptions] = useState(false);

  const handleUpdateIsRead = (noti_id, user_id, target_user_id, defined_noti_id, is_read) => {
    setNotifications((prev) => {
      prev.forEach((notification) => {
        if (notification.noti_id == noti_id) {
          notification.is_read = true;
        }
      });
      return JSON.parse(JSON.stringify(prev));
    });

    const payload = {
      is_read,
      user_id,
      target_user_id,
      defined_noti_id,
    };

    const configurations = {
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };
    axiosInstance
      .put(`/notifications/${user_id}/${target_user_id}/${defined_noti_id}`, payload, configurations)
      .then((result) => {})
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className={cx('wrapper')}>
      <div className={cx('header')}>
        <h4 className={cx('header-title')}>Notification</h4>
        <button className={cx('options-btn')} onClick={() => setIsOpenOptions((prev) => !prev)}>
          <ThreeDotIcon width="2.3rem" height="2.3rem" />
        </button>

        {isOpenOptions && (
          <div className={cx('options-content')}>
            <TippyWrapper
              className={cx('menu-options')}
              onClick={() => {
                setIsOpenOptionBtn(false);
                setIsOpenNotiItemOptions(false);
              }}
            >
              <IconBtn
                className={cx('option-item')}
                icon={<TickIcon height="2.5rem" width="2.5rem" />}
                title={'Mark all as read'}
                medium
              />
              <IconBtn
                className={cx('option-item')}
                icon={<GearIcon height="2rem" width="2rem" />}
                title={'Setting'}
                medium
              />
            </TippyWrapper>
          </div>
        )}
      </div>
      <div className={cx('body')}>
        {notifications?.map((notification) => {
          let url = `http://localhost:3000/profiles/${notification.user_id}/posts`;
          let description = '';
          if (notification.defined_noti_id == 'noti_01') {
            description = `${notification.sender_name} sent you a friend request`;
          } else if (notification.defined_noti_id == 'noti_02') {
            description = `${notification.sender_name} accepted your friend request`;
          } else if (notification.defined_noti_id == 'noti_03') {
            description = `${notification.sender_name} added new post`;
            url = `http://localhost:3000/posts/post-preview/${notification.post_id}`;
          } else if (notification.defined_noti_id == 'noti_04') {
            description = `${notification.sender_name} reacted your post`;
            url = `http://localhost:3000/posts/post-preview/${notification.post_id}`;
          } else if (notification.defined_noti_id == 'noti_05') {
            description = `${notification.sender_name} commented on your post`;
            url = `http://localhost:3000/posts/post-preview/${notification.post_id}`;
          }

          return (
            <NotificationItem
              key={notification.noti_id}
              noti_id={notification.noti_id}
              className={cx('noti-item')}
              avatar={notification.sender_avatar}
              header_title={notification.sender_name}
              timeStamp={moment(notification.created_at).fromNow()}
              noti_code={notification.noti_code}
              description={description}
              href={url}
              is_read={notification.is_read}
              onClick={() => {
                if (notification.is_read) {
                  return;
                }
                handleUpdateIsRead(
                  notification.noti_id,
                  notification.user_id,
                  notification.target_user_id,
                  notification.defined_noti_id,
                  1,
                );
              }}
              options={[
                {
                  icon: <TickIcon width="2.4rem" height="2.4rem" />,
                  title: 'Mark as read',
                },
              ]}
            />
          );
        })}

        {(!notifications || notifications.length == 0) && (
          <div className={cx('empty-noti')}>
            <img alt="" src={require('../../assets/images/empty-noti.png')} />
            <h3 className={cx('empty-noti-title')}>You have no notification</h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationTab;
