import classNames from 'classnames/bind';
import styles from './PasswordManagement.module.scss';
import Cookies from 'universal-cookie';
import { useContext, useEffect, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AxiosInstanceContext } from '~/components/AxiosInterceptorWrapper/AxiosInterceptorWrapper';
import SettingItem from '../components/SettingItem/SettingItem';
import ChangePasswordModal from '../components/ChangePasswordModal/ChangePasswordModal';
import { IsOpenChangePasswordModalContext } from '~/Context/IsOpenChangePasswordModalContext';

const cx = classNames.bind(styles);
const cookies = new Cookies();

function PasswordManagement() {
  // CONSTANCE
  const userInfoContext = useContext(UserInfoContext);
  const user = userInfoContext.user;

  const axiosInstanceContext = useContext(AxiosInstanceContext);
  const axiosInstance = axiosInstanceContext;

  const isOpenChangePasswordModalContext = useContext(IsOpenChangePasswordModalContext);
  const isOpenChangePasswordModal = isOpenChangePasswordModalContext.isOpen;
  const setIsOpenChangePasswordModal = isOpenChangePasswordModalContext.setIsOpen;

  // USE_NAVIGATE
  const navigate = useNavigate();

  // USE_STATE

  // USE_EFFECT

  // FUNCTION_HANDLER
  const handleRedirectToProfile = (friend_id) => {
    navigate(`/profiles/${friend_id}/posts`, { replace: true });
  };

  return (
    <div className={cx('wrapper')}>
      <h3 className={cx('header-title')}>Password and security</h3>
      <div className={cx('container')}>
        <div className={cx('setting-list')}>
          <SettingItem
            className={cx('option-item')}
            title={'Change Password'}
            onClick={() => setIsOpenChangePasswordModal(true)}
          />
        </div>
      </div>
    </div>
  );
}

export default PasswordManagement;
