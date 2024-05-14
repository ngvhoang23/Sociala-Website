import { useContext, useEffect, useState, useTransition } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import Cookies from 'universal-cookie';
import axios from 'axios';
import classNames from 'classnames/bind';
import styles from './Login.module.scss';
import { Navigate, useNavigate } from 'react-router-dom';
import { TickBoxIcon, UnCheckTickBox } from '~/components/Icons';
import LoadingSpinner from '~/components/LoadingSpinner';
import { faPersonHarassing } from '@fortawesome/free-solid-svg-icons';
import useForm from '~/hooks/useForm';
import InputItem from '~/components/InputItem';

const cookies = new Cookies();

const cx = classNames.bind(styles);
function Login() {
  const navigate = useNavigate();

  // ================ USE STATE =======================
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState();
  const [isRememberAcc, setIsRememberAcc] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const _handleSubmit = () => {
    // prevent the form from refreshing the whole page
    setIsLoading(true);

    const configuration = {
      method: 'post',
      url: 'http://localhost:5000/auth/login',
      data: {
        user_name: userName,
        password,
      },
    };
    axios(configuration)
      .then((result) => {
        setMessage({
          status: 1,
          content: 'Sign in successfully',
        });
        cookies.set('ACCESS_TOKEN', result.data.access_token, {
          path: '/',
        });
        cookies.set('REFRESH_TOKEN', result.data.refresh_token, {
          path: '/',
        });
        window.location.href = `/new-feeds`;
      })
      .catch((error) => {
        if (error.response.data.message == 'user_non_existent' || error.response.data.message == 'password_was_wrong') {
          setMessage({
            status: 0,
            content: 'User name or password was wrong',
          });
        }
        error = new Error();
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleRedirectToRegisterPage = () => {
    navigate('/register', { replace: true });
  };

  const { handleBlur, handleChange, handleUpdate, setValues, errors, handleSubmit } = useForm(_handleSubmit);

  useEffect(() => {
    setValues({
      username: { val: userName, is_required: true },
      password_required: { val: password, is_required: true },
    });
  }, []);

  const handleRedirectToForgotPassword = () => {
    navigate('/forgot-password', { replace: true });
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className={cx('wrapper')}>
      <div className={cx('container')}>
        <div className={cx('bg-image')}></div>
        <div className={cx('log-in-content')}>
          <div className={cx('header')}>
            <h2 className={cx('header-title')}>Sign In</h2>
            {isLoading && <LoadingSpinner large thin />}
          </div>
          <div className={cx('log-in-form')}>
            <InputItem
              lable_title={'USERNAME'}
              placeholder={'User name...'}
              value={userName}
              name="username"
              type="username"
              onChange={(e) => {
                setUserName(e.target.value);
                handleUpdate(e);
              }}
              input_type="input"
              error={errors.username}
              onBlur={handleBlur}
              onKeyDown={handleKey}
            />

            <InputItem
              required
              lable_title={'PASSWORD'}
              placeholder={'Password...'}
              value={password}
              name="password_required"
              type="password"
              onChange={(e) => {
                setPassword(e.target.value);
                handleUpdate(e);
              }}
              input_type="input"
              onBlur={handleBlur}
              error={errors.password_required}
              onKeyDown={handleKey}
            />

            <button className={cx('submit-btn')} onClick={handleSubmit}>
              Sign In
            </button>
          </div>
          <div className={cx('footer')}>
            {/* <div className={cx('remember-acc')} onClick={() => setIsRememberAcc((prev) => !prev)}>
              {isRememberAcc ? (
                <TickBoxIcon className={cx('check-box-icon')} height="2.6rem" width="2.6rem" />
              ) : (
                <UnCheckTickBox className={cx('check-box-icon')} height="2.6rem" width="2.6rem" />
              )}
              <p className={cx('remeber-acc-title')}>Remember Me</p>
            </div> */}
            <div className={cx('forgot-password-container')}>
              <button className={cx('forgot-password')} onClick={handleRedirectToForgotPassword}>
                Forgot Password
              </button>
            </div>
            <div className={cx('signup-content')}>
              <p className={cx('signup-title')}>Not a member? </p>
              <button className={cx('sign-up-btn')} onClick={handleRedirectToRegisterPage}>
                Sign Up
              </button>
            </div>
            {message && (
              <div
                className={cx(
                  'message',
                  { 'error-message': message.status !== 1 },
                  { 'successful-message': message.status === 1 },
                )}
              >
                {message.content}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
