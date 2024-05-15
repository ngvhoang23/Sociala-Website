import classNames from 'classnames/bind';
import styles from './EmailManagement.module.scss';
import Cookies from 'universal-cookie';
import { useContext, useEffect, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AxiosInstanceContext } from '~/components/AxiosInterceptorWrapper/AxiosInterceptorWrapper';
import SettingItem from '../components/SettingItem/SettingItem';
import ChangePasswordModal from '../components/ChangePasswordModal/ChangePasswordModal';
import { IsOpenChangePasswordModalContext } from '~/Context/IsOpenChangePasswordModalContext';
import { IsOpenChangeEmailModalContext } from '~/Context/IsOpenChangeEmailModalContext';

const cx = classNames.bind(styles);
const cookies = new Cookies();

function EmailManagement() {
  // CONSTANCE
  const userInfoContext = useContext(UserInfoContext);
  const user = userInfoContext.user;

  const axiosInstanceContext = useContext(AxiosInstanceContext);
  const axiosInstance = axiosInstanceContext;

  const isOpenChangeEmailModalContext = useContext(IsOpenChangeEmailModalContext);
  const isOpenChangeEmailModal = isOpenChangeEmailModalContext.isOpen;
  const setIsOpenChangeEmailModal = isOpenChangeEmailModalContext.setIsOpen;

  // USE_NAVIGATE
  const navigate = useNavigate();

  // USE_STATE

  // USE_EFFECT

  // FUNCTION_HANDLER

  return (
    <div className={cx('wrapper')}>
      <h3 className={cx('header-title')}>Email</h3>
      <div className={cx('container')}>
        <div className={cx('setting-list')}>
          <SettingItem
            className={cx('option-item')}
            title={'Change Email'}
            onClick={() => setIsOpenChangeEmailModal(true)}
          />
        </div>
      </div>
    </div>
  );
}

export default EmailManagement;
