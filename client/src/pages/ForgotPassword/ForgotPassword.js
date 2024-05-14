import { useContext, useEffect, useRef, useState, useTransition } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import Cookies from 'universal-cookie';
import axios from 'axios';
import classNames from 'classnames/bind';
import styles from './ForgotPassword.module.scss';
import { Navigate, useNavigate } from 'react-router-dom';
import { TickBoxIcon, UnCheckTickBox } from '~/components/Icons';
import LoadingSpinner from '~/components/LoadingSpinner';
import { faPersonHarassing } from '@fortawesome/free-solid-svg-icons';
import useForm from '~/hooks/useForm';
import InputItem from '~/components/InputItem';

const cookies = new Cookies();

const cx = classNames.bind(styles);
function ForgotPassword() {
  const navigate = useNavigate();

  const refInterval = useRef();

  // ================ USE STATE =======================

  const [verifyTimeout, setVerifyTimeout] = useState();
  const [status, setStatus] = useState();
  const [email, setEmail] = useState('');

  const _handleSubmit = () => {
    clearInterval(refInterval?.current);
    setStatus(0);
    const configuration = {
      method: 'get',
      url: `http://localhost:5000/auth/password-reset-token/${email}`,
      params: {
        user_name: email,
      },
    };

    axios(configuration)
      .then((result) => {
        setVerifyTimeout(result.data.timeout);
        handleSetTimeout();
        setStatus(1);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    return () => clearInterval(refInterval.current);
  }, []);

  useEffect(() => {
    if (verifyTimeout <= 0) {
      clearInterval(refInterval.current);
    }
  }, [verifyTimeout]);

  const handleSetTimeout = () => {
    refInterval.current = setInterval(() => {
      setVerifyTimeout((prev) => prev - 1);
    }, 1000);
  };

  const { handleBlur, handleChange, errors, setValues, handleSubmit } = useForm(_handleSubmit);

  useEffect(() => {
    setValues({
      email: { val: email, is_required: true },
    });
  }, []);

  return (
    <div className={cx('wrapper')}>
      <div className={cx('container')}>
        <div className={cx('log-in-content')}>
          <div className={cx('header')}>
            {status === 0 && <LoadingSpinner className={cx('loading-spin')} large thin />}

            <h2 className={cx('header-title')}>Type your email</h2>
            <div className={cx('message', 'successful-message')}>We will send a link to reset token to your email</div>
          </div>
          <div className={cx('log-in-form')}>
            <InputItem
              className={cx('email-inp')}
              placeholder={'Email...'}
              value={email}
              name="email"
              type="email"
              input_type="input"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              onBlur={handleBlur}
              error={errors?.email}
            />
          </div>
          <div className={cx('footer')}>
            <button className={cx('submit-btn')} onClick={handleSubmit}>
              {verifyTimeout === 0 ? 'Resend Token' : 'Send Token'}
            </button>
            {status ? (
              <div
                className={cx('token-timeout', { 'active-link': verifyTimeout }, { 'expired-link': !verifyTimeout })}
              >
                {verifyTimeout ? <p>The link will be expired in</p> : <p>The link expired</p>}

                {verifyTimeout ? (
                  <LoadingSpinner className={cx('timeout-spin')} large thin time_out={verifyTimeout} color={'green'} />
                ) : (
                  <></>
                )}
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
