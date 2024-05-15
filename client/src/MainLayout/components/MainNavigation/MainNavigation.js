import TippyHeadless from '@tippyjs/react/headless';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import styles from './MainNavigation.module.scss';
import classNames from 'classnames/bind';
import Option from './Option';
import { BellIcon, GearIcon, HomeIcon, LogOutIcon, MessageDot, UserGroupIcon } from '~/components/Icons';
import { memo, useContext, useEffect, useRef, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import { NotificationsContext } from '~/Context/NotificationsContext';
import { ContactsContext } from '~/Context/ContactsContext';
import { NewMessageContext } from '~/Context/NewMessageContext';
import NotificationTab from '~/components/NotificationTab';
import TippyWrapper from '~/components/TippyWrapper';
import ChatListContainer from '~/components/ChatListContainer';
import IconBtn from '~/components/IconBtn';
import useOutsideAlerter from '~/hooks/useOutsideAlerter';
import { LogoIcon } from '~/components/EmotionIcon/EmotionIcon';
import { NeedToReLoadContext } from '~/Context/NeedToReLoadContext';
import { IsLoadingContext } from '~/Context/IsLoadingContext';
import MediaItem2 from '~/components/MediaItem2/MediaItem2';

const cookies = new Cookies();

const cx = classNames.bind(styles);

function MainNavigation({ className }) {
  const userInfoContext = useContext(UserInfoContext);
  const user = userInfoContext.user;

  // USE_REF
  const notificationRef = useRef();
  const chatListRef = useRef();
  const userOptionsRef = useRef();
  const settingOptionsRef = useRef();

  // USE_NAVIGATE
  const navigate = useNavigate();

  // USE_CONTEXT
  const notificationsContext = useContext(NotificationsContext);
  const notifications = notificationsContext.notifications;

  const contactsContext = useContext(ContactsContext);
  const contacts = contactsContext.contacts;

  const newMessageContext = useContext(NewMessageContext);
  const newMessage = newMessageContext.newMessage;

  const needToReLoadSignalContext = useContext(NeedToReLoadContext);
  const reLoadingSignal = needToReLoadSignalContext.reLoadingSignal;
  const setReLoadingSignal = needToReLoadSignalContext.setReLoadingSignal;

  const isLoadingContext = useContext(IsLoadingContext);
  const isLoading = isLoadingContext.isLoading;
  const setIsLoading = isLoadingContext.setIsLoading;

  // USE_STATE
  const [unreadNoti, setUnreadNoti] = useState(0);
  const [unreadContact, setUnreadContact] = useState(0);
  const [isOpenNotification, setIsOpenNotification] = useState(false);
  const [isShowUserOptions, setIsShowUserOptions] = useState(false);
  const [isOpenChatList, setIsOpenChatList] = useState(false);
  const [isShowSettingOptions, setIsShowSettingOptions] = useState(false);

  const handleLogOut = () => {
    // destroy the cookie
    cookies.remove('ACCESS_TOKEN', { path: '/' });
    cookies.remove('REFRESH_TOKEN', { path: '/' });
    localStorage.clear();
    // redirect user to the landing page
    window.location.href = '/';
  };

  const handleRedirectToProfile = () => {
    navigate(`/my-profile/posts`, { replace: true });
  };

  useEffect(() => {
    const getNotiQuantity = () => {
      return notifications.reduce((quantity, noti) => {
        if (noti.is_read) {
          return quantity;
        } else {
          return quantity + 1;
        }
      }, 0);
    };
    setUnreadNoti(getNotiQuantity());
  }, [notifications]);

  useEffect(() => {
    const getUnreadContactQuantity = () => {
      return contacts?.reduce((quantity, contact) => {
        if (contact.isSeen) {
          return quantity;
        } else {
          return quantity + 1;
        }
      }, 0);
    };

    setUnreadContact(getUnreadContactQuantity());
  }, [contacts, newMessage]);

  useEffect(() => {
    if (reLoadingSignal?.stories && reLoadingSignal?.posts) {
      setIsLoading(false);
    }
  }, [reLoadingSignal]);

  // USE_CLICKING_OUTSIDE
  useOutsideAlerter(userOptionsRef, () => {
    setIsShowUserOptions(false);
  });

  useOutsideAlerter(chatListRef, () => {
    setIsOpenChatList(false);
  });

  useOutsideAlerter(notificationRef, () => {
    setIsOpenNotification(false);
  });

  useOutsideAlerter(settingOptionsRef, () => {
    setIsShowSettingOptions(false);
  });

  const handleOpenHomePage = () => {
    navigate(`/new-feeds`, { replace: true });
    handleReloadingPage();
  };

  const handleRedirectToSettingsDashBoard = () => {
    navigate(`/user/setting`, { replace: true });
  };

  const handleReloadingPage = () => {
    setReLoadingSignal((prev) => ({ status: !prev.status }));
    setIsLoading(true);
  };

  return (
    <div className={cx('wrapper', className)}>
      <div className={cx('header')}>
        <div className={cx('app-logo-container')} to={`/new-feeds`} onClick={handleOpenHomePage}>
          <LogoIcon width="52px" height="52px" />
          <span className={cx('logo-title')}>Sociala.</span>
        </div>
      </div>

      <div className={cx('body')}>
        <Option
          className={cx('option-item')}
          icon={<HomeIcon width={'2.8rem'} height={'2.8rem'} />}
          to="/new-feeds"
          onClick={handleReloadingPage}
        />
        <Option
          className={cx('option-item')}
          icon={<MessageDot width={'3rem'} height={'3rem'} />}
          to="/messenger"
          noti_tag={unreadContact}
        />
        <Option
          className={cx('option-item')}
          icon={<UserGroupIcon width={'2.8rem'} height={'2.8rem'} />}
          to="/contacts"
        />
      </div>

      <div className={cx('footer')}>
        <div ref={notificationRef}>
          <TippyHeadless
            visible={isOpenNotification}
            interactive={true}
            placement="top-start"
            delay={[200, 0]}
            offset={[0, 10]}
            render={(attrs) => (
              <div className="box" tabIndex="-1" {...attrs}>
                <NotificationTab />
              </div>
            )}
          >
            <span>
              <Option
                className={cx('option-item')}
                icon={<BellIcon width={'2.8rem'} height={'2.8rem'} />}
                noti_tag={unreadNoti}
                active={isOpenNotification}
                onClick={() => {
                  setUnreadNoti(0);
                  setIsOpenNotification((prev) => !prev);
                }}
              />
            </span>
          </TippyHeadless>
        </div>

        <div ref={chatListRef}>
          <TippyHeadless
            visible={isOpenChatList}
            interactive={true}
            delay={[2000, 0]}
            offset={[-6, -570]}
            placement="top-end"
            render={(attrs) => (
              <div className="box" tabIndex="-1" {...attrs}>
                <TippyWrapper>
                  <ChatListContainer setIsOpen={setIsOpenChatList} />
                </TippyWrapper>
              </div>
            )}
          >
            <span>
              <Option
                className={cx('option-item')}
                icon={<MessageDot width={'2.8rem'} height={'2.8rem'} />}
                active={isOpenChatList}
                noti_tag={unreadContact}
                onClick={() => {
                  setIsOpenChatList((prev) => !prev);
                }}
              />
            </span>
          </TippyHeadless>
        </div>

        <div ref={settingOptionsRef}>
          <TippyHeadless
            visible={isShowSettingOptions}
            interactive={true}
            placement="top-start"
            delay={[200, 0]}
            offset={[-6, 6]}
            render={(attrs) => (
              <div className="box" tabIndex="-1" {...attrs}>
                <TippyWrapper className={cx('user-options')}>
                  <IconBtn
                    className={cx('menu-item')}
                    title={'Settings'}
                    icon={<GearIcon width={'2.5rem'} height={'2.5rem'} />}
                    onClick={() => {
                      handleRedirectToSettingsDashBoard(user.user_id);
                      setIsShowSettingOptions(false);
                    }}
                  />
                </TippyWrapper>
              </div>
            )}
          >
            <span>
              <Option
                className={cx('option-item')}
                icon={<GearIcon width={'2.5rem'} height={'2.5rem'} />}
                active={isShowSettingOptions}
                onClick={() => setIsShowSettingOptions((prev) => !prev)}
              />
            </span>
          </TippyHeadless>
        </div>

        <div ref={userOptionsRef}>
          <TippyHeadless
            visible={isShowUserOptions}
            interactive={true}
            placement="top-start"
            delay={[200, 0]}
            offset={[-6, 6]}
            render={(attrs) => (
              <div className="box" tabIndex="-1" {...attrs}>
                <TippyWrapper className={cx('user-options')}>
                  <IconBtn
                    className={cx('menu-item')}
                    title={user.full_name}
                    // icon={<img className={cx('profile_avatar')} src={user.user_avatar} alt="" />}
                    icon={
                      <MediaItem2
                        item={{ url: user.user_avatar, type: 'image' }}
                        width={40}
                        height={40}
                        border_radius={10000}
                        _styles={{
                          boxShadow: 'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px',
                        }}
                      />
                    }
                    onClick={() => {
                      handleRedirectToProfile(user.user_id);
                      setIsShowUserOptions(false);
                    }}
                  />
                  <IconBtn
                    className={cx('menu-item', 'log-out-btn')}
                    title="Log Out"
                    icon={<LogOutIcon width={'2.2rem'} height={'2.2rem'} />}
                    onClick={() => {
                      handleLogOut();
                      setIsShowUserOptions(false);
                    }}
                  />
                </TippyWrapper>
              </div>
            )}
          >
            <span>
              <Option
                className={cx('option-item')}
                icon={
                  <MediaItem2
                    item={{ url: user.user_avatar, type: 'image' }}
                    width={44}
                    height={44}
                    border_radius={10000}
                    _styles={{
                      boxShadow: 'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px',
                    }}
                  />
                }
                active={isShowUserOptions}
                onClick={() => setIsShowUserOptions((prev) => !prev)}
              />
            </span>
          </TippyHeadless>
        </div>
      </div>
    </div>
  );
}

export default memo(MainNavigation);
