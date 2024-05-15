import classNames from 'classnames/bind';
import styles from './ChangeEmailModal.module.scss';
import { CloseIcon, TickIcon } from '~/components/Icons';
import InputItem from '~/components/InputItem';
import { useContext, useEffect, useRef, useState } from 'react';
import useForm from '~/hooks/useForm';
import { AxiosInstanceContext } from '~/components/AxiosInterceptorWrapper/AxiosInterceptorWrapper';
import Cookies from 'universal-cookie';
import LoadingSpinner from '~/components/LoadingSpinner';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';

const cx = classNames.bind(styles);
const cookies = new Cookies();

function ChangeEmailModal({ onClose }) {
  const refInterval = useRef();

  const axiosInstanceContext = useContext(AxiosInstanceContext);
  const axiosInstance = axiosInstanceContext;

  const userInfoContext = useContext(UserInfoContext);
  const user = userInfoContext.user;
  const setUser = userInfoContext.setUser;

  const [email, setEmail] = useState('');
  const [statusInfo, setStatusInfo] = useState();
  const [isVerifying, setIsVerifying] = useState(false);
  const [token, setToken] = useState();
  const [duration, setDuration] = useState();

  const handleGetVerificationCode = () => {
    setStatusInfo({ status: 0, content: 'Waiting a minutes...' });
    const payload = {
      email_address: email,
    };

    const configurations = {
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };

    axiosInstance
      .post(`/auth/email/verifying`, payload, configurations)
      .then((result) => {
        setIsVerifying(true);
        setDuration(result.data.duration / 1000);
        handleSetTimeout();
        setStatusInfo();
      })
      .catch((error) => {
        setStatusInfo({ status: -1, content: 'Fail :(' });
        console.log(error);
      });
  };

  const handleChangeEmail = () => {
    const payload = {
      email: email,
      token: token,
    };

    const configurations = {
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };

    axiosInstance
      .post(`/auth/email`, payload, configurations)
      .then((result) => {
        setStatusInfo({ status: 1, content: 'Change Email Successfully' });
        setUser((prev) => {
          return { ...prev, auth_email: email };
        });
        setTimeout(() => {
          onClose();
        }, 1000);
      })
      .catch((error) => {
        if (error?.response?.data == 'EMAIL_EXISTED') {
          setStatusInfo({ status: -1, content: 'Email is already used :(' });
        } else {
          setStatusInfo({ status: -1, content: 'Fail :(' });
        }
        console.log(error);
      });
  };

  const { handleChange, handleBlur, errors, setValues, handleSubmit } = useForm(handleGetVerificationCode);

  useEffect(() => {
    setValues({
      email: { val: email, is_required: true },
    });
  }, []);

  useEffect(() => {
    return () => clearInterval(refInterval.current);
  }, []);

  useEffect(() => {
    if (duration <= 0) {
      clearInterval(refInterval.current);
      setStatusInfo({ status: -1, content: 'Token Expired :(' });
      setTimeout(() => {
        setIsVerifying(false);
        setToken();
        setDuration();
        setStatusInfo();
      }, 1000);
    }
  }, [duration]);

  const handleSetTimeout = () => {
    refInterval.current = setInterval(() => {
      setDuration((prev) => prev - 1);
    }, 1000);
  };

  return (
    <div className={cx('wrapper')} onClick={() => onClose()}>
      <div className={cx('container')} onClick={(e) => e.stopPropagation()}>
        <div className={cx('header')}>
          <h3 className={cx('alert-title')}>Change Email</h3>
          {statusInfo?.status === 0 && !isVerifying ? (
            <LoadingSpinner className={cx('loading-spin')} large thin />
          ) : (
            <></>
          )}
          {duration && isVerifying ? (
            <LoadingSpinner className={cx('loading-spin')} large thin time_out={duration} />
          ) : (
            <></>
          )}

          <button className={cx('close-btn')} onClick={onClose}>
            <CloseIcon height="2.2rem" width="2.2rem" />
          </button>
        </div>
        {!isVerifying ? (
          <div className={cx('content')}>
            <div className={cx('body')}>
              <InputItem
                className={cx('input-item')}
                lable_title="New Email"
                placeholder="Type your new email..."
                value={email}
                name="email"
                type="text"
                is_required
                input_type={'input'}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                onBlur={handleBlur}
                error={errors.email}
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
                Get code
              </button>
            </div>
          </div>
        ) : (
          <div className={cx('content')}>
            <div className={cx('messages')}>
              <span className={cx('success-icon')}>
                <TickIcon />
              </span>
              <p className={cx('description')}>
                We emailed you a six-digit code to <span style={{ color: '#1e74fd', fontWeight: 'bold' }}>{email}</span>
                . Enter the code below to confirm you email address
              </p>
            </div>
            <div className={cx('body')}>
              <InputItem
                className={cx('input-item')}
                lable_title="Verification Code"
                placeholder="Verification Code..."
                value={token}
                type="text"
                input_type={'input'}
                onChange={(e) => {
                  setToken(e.target.value);
                }}
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
              <button className={cx('confirm-btn')} onClick={handleChangeEmail}>
                Change Email
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChangeEmailModal;
