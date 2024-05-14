import classNames from 'classnames/bind';
import styles from './ChangePasswordModal.module.scss';
import { CloseIcon } from '~/components/Icons';
import InputItem from '~/components/InputItem';
import { useContext, useEffect, useState } from 'react';
import useForm from '~/hooks/useForm';
import { AxiosInstanceContext } from '~/components/AxiosInterceptorWrapper/AxiosInterceptorWrapper';
import Cookies from 'universal-cookie';
import LoadingSpinner from '~/components/LoadingSpinner';

const cx = classNames.bind(styles);
const cookies = new Cookies();

function ChangePasswordModal({ onClose }) {
  const axiosInstanceContext = useContext(AxiosInstanceContext);
  const axiosInstance = axiosInstanceContext;

  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [statusInfo, setStatusInfo] = useState();

  const onSubmit = () => {
    setStatusInfo({ status: 0, content: 'Waiting a minutes...' });
    const payload = {
      old_password: currentPassword,
      new_password: newPassword,
    };

    const configurations = {
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };

    axiosInstance
      .put(`/auth/password`, payload, configurations)
      .then((result) => {
        setStatusInfo({ status: 1, content: 'Change Password Successfully' });
        setTimeout(() => {
          onClose();
        }, 1000);
      })
      .catch((error) => {
        if (error.response.data.message === 'WRONG_PASSWORD') {
          setStatusInfo({ status: -1, content: 'Current password was wrong' });
        } else {
          setStatusInfo({ status: -1, content: 'Change password failed' });
        }
        console.log(error);
      });
  };

  const { handleChange, handleBlur, errors, setValues, handleSubmit } = useForm(onSubmit);

  useEffect(() => {
    setValues({
      text: { val: currentPassword, is_required: true },
      password: { val: newPassword, is_required: true },
      confirm_password: { val: confirmPassword, is_required: true },
    });
  }, []);

  return (
    <div className={cx('wrapper')} onClick={() => onClose()}>
      <div className={cx('container')} onClick={(e) => e.stopPropagation()}>
        <div className={cx('header')}>
          <h3 className={cx('alert-title')}>Change Password</h3>
          {statusInfo?.status === 0 && <LoadingSpinner className={cx('loading-spin')} large thin />}
          <p className={cx('description')}>
            Your password must be at least 6 characters and should include a combination of numbers, letters and special
            characters (!$@%).
          </p>
          <button className={cx('close-btn')} onClick={onClose}>
            <CloseIcon height="2.2rem" width="2.2rem" />
          </button>
        </div>
        <div className={cx('body')}>
          <InputItem
            className={cx('input-item')}
            lable_title="Current password"
            placeholder="Current password..."
            value={currentPassword}
            name="text"
            type="password"
            is_required
            input_type={'input'}
            onChange={(e) => {
              handleChange(e);
              setCurrentPassword(e.target.value);
            }}
            onBlur={handleBlur}
            error={errors.password}
          />

          <InputItem
            className={cx('input-item')}
            lable_title="New password"
            placeholder="New password..."
            value={newPassword}
            name="password"
            is_required
            type="password"
            input_type={'input'}
            onChange={(e) => {
              setNewPassword(e.target.value);
            }}
            onBlur={handleBlur}
            error={errors.password}
          />

          <InputItem
            className={cx('input-item')}
            lable_title="Re-type new password"
            placeholder="Re-type new password..."
            value={confirmPassword}
            name="confirm_password"
            type="password"
            input_type={'input'}
            is_required
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
            onBlur={handleBlur}
            error={errors.confirm_password}
          />
        </div>
        <div className={cx('footer')}>
          {statusInfo?.status ? (
            <div
              className={cx(
                'message',
                { 'error-message': statusInfo?.status !== 1 },
                { 'successful-message': statusInfo?.status === 1 },
              )}
            >
              {statusInfo.content}
            </div>
          ) : (
            <></>
          )}
          <button className={cx('confirm-btn')} onClick={handleSubmit}>
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChangePasswordModal;
