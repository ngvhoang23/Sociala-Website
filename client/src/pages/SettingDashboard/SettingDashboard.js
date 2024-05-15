import { useContext, useEffect, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import classNames from 'classnames/bind';
import styles from './SettingDashboard.module.scss';
import { GearIcon, GmailIcon, LockIcon } from '~/components/Icons';
import { SocketContext } from '~/Context/SocketContext';
import { AxiosInstanceContext } from '~/components/AxiosInterceptorWrapper/AxiosInterceptorWrapper';

const cookies = new Cookies();

const cx = classNames.bind(styles);

function ProfileChanger({ children }) {
  const userInfoContext = useContext(UserInfoContext);
  const user = userInfoContext.user;

  // USE_NAVIGATE
  const navigate = useNavigate();

  // USE_CONTEXT

  const socket = useContext(SocketContext);

  const axiosInstanceContext = useContext(AxiosInstanceContext);
  const axiosInstance = axiosInstanceContext;

  // USE_STATE
  const [userInfo, setUserInfo] = useState({});
  const [friendStatus, setRelationshiptatus] = useState();
  const [currentTab, setCurrentTab] = useState();

  // USE_EFFECT
  useEffect(() => {
    const params = {
      user_id: user.user_id,
    };

    const configurations = {
      params: params,
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };

    axiosInstance
      .get(`/users/${user.user_id}`, configurations)
      .then((result) => {
        const profile_package = result.data;
        setUserInfo(profile_package.profile_info);
      })
      .catch((error) => {
        error = new Error();
      });
  }, [user.user_id]);

  // FUNCTION_HANDLER

  const handleOpenPasswordSetting = () => {
    navigate(`/user/setting/password`, { replace: true });
  };

  const handleOpenEmailSetting = () => {
    navigate(`/user/setting/email`, { replace: true });
  };

  return (
    <div className={cx('wrapper')}>
      <div className={cx('side-bar')}>
        <div className={cx('side-bar-header')}>
          <h3 className={cx('header-title')}>Setting</h3>
        </div>
        <div className={cx('navs-container')}>
          <div
            className={cx('nav-item', { 'nav-item-active': currentTab == 'all-friends' })}
            onClick={handleOpenPasswordSetting}
          >
            <div className={cx('nav-item-icon')}>
              <LockIcon className={cx('ellipsis-icon')} width={'2.2rem'} height={'2.2rem'} />
            </div>
            <h4 className={cx('nav-item-title')}>Password</h4>
          </div>

          <div
            className={cx('nav-item', { 'nav-item-active': currentTab == 'all-friends' })}
            onClick={handleOpenEmailSetting}
          >
            <div className={cx('nav-item-icon')}>
              <GmailIcon className={cx('ellipsis-icon')} width={'2.2rem'} height={'2.2rem'} />
            </div>
            <h4 className={cx('nav-item-title')}>Email</h4>
          </div>
        </div>
      </div>
      <div className={cx('content')}>{children}</div>
    </div>
  );
}

export default ProfileChanger;
