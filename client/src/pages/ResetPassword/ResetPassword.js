import { useContext, useEffect, useRef, useState, useTransition } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import Cookies from 'universal-cookie';
import axios from 'axios';
import classNames from 'classnames/bind';
import styles from './ResetPassword.module.scss';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { TickBoxIcon, UnCheckTickBox } from '~/components/Icons';
import LoadingSpinner from '~/components/LoadingSpinner';
import { faPersonHarassing } from '@fortawesome/free-solid-svg-icons';
import useForm from '~/hooks/useForm';
import InputItem from '~/components/InputItem';

const cookies = new Cookies();

const cx = classNames.bind(styles);
function ResetPassword() {
  const navigate = useNavigate();

  const { user_id, token } = useParams();

  // ================ USE STATE =======================

  const [statusInfo, setStatusInfo] = useState();
  const [password, setPassword] = useState('');

  const _handleSubmit = () => {
    setStatusInfo({
      content: 'Waiting For Confirmation...',
      status: 0,
    });
    const configuration = {
      method: 'post',
      url: `http://localhost:5000/auth/new-password`,
      data: {
        new_password: password,
        user_id: user_id,
        verification_token: token,
      },
    };

    axios(configuration)
      .then((result) => {
        setStatusInfo({
          content: 'Your password was changed successfully',
          status: 1,
        });
        navigate('/new-feeds', { replace: true });
      })
      .catch((err) => {
        setStatusInfo({
          content: 'Change password Failed',
          status: -1,
        });
        console.log(err);
      });
  };

  const { handleBlur, errors, setValues, handleSubmit } = useForm(_handleSubmit);

  useEffect(() => {
    setValues({
      password: { val: password, is_required: true },
    });
  }, []);

  return (
    <div className={cx('wrapper')}>
      <div className={cx('container')}>
        <div className={cx('log-in-content')}>
          <div className={cx('header')}>
            {statusInfo?.status === 0 && <LoadingSpinner className={cx('loading-spin')} large thin />}
            <h2 className={cx('header-title')}>Type Your New Password</h2>
            <div className={cx('message', 'successful-message')}>We will set this to your new password</div>
          </div>
          <div className={cx('log-in-form')}>
            <InputItem
              className={cx('password-inp')}
              placeholder={'Password...'}
              value={password}
              name="password"
              type="password"
              input_type="input"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              onBlur={handleBlur}
              error={errors?.password}
            />
          </div>
          <div className={cx('footer')}>
            <button className={cx('submit-btn')} onClick={handleSubmit}>
              Submit
            </button>
            {statusInfo && (
              <div
                className={cx(
                  'status-message',
                  { 'success-status': statusInfo.status == 1 },
                  { 'failure-status': statusInfo.status == -1 },
                  { 'pending-status': statusInfo.status == 0 },
                )}
              >
                {statusInfo.content}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
