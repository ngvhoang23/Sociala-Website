import { useContext, useEffect, useRef, useState, useTransition } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import axios from 'axios';
import styles from './Register.module.scss';
import classNames from 'classnames/bind';
import Cookies from 'universal-cookie';
import { formatDate } from '~/UserDefinedFunctions';
import LoadingSpinner from '~/components/LoadingSpinner';
import { ArrowRightIcon, RightShiftArrowIcon, TickBoxIcon, UnCheckTickBox } from '~/components/Icons';

import 'react-day-picker/dist/style.css';
import MyDatePicker from '~/components/MyDatePicker';
import { useNavigate } from 'react-router-dom';
import useForm from '~/hooks/useForm';
import InputItem from '~/components/InputItem';

const cookies = new Cookies();

const cx = classNames.bind(styles);

function Register() {
  // USE_NAVIGATE
  const navigate = useNavigate();

  const refInterval = useRef();

  const [status, setStatus] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [birthDate, setBirthDate] = useState({ day: 1, month: 1, year: 2020 });
  const [isLoading, setIsLoading] = useState(false);
  const [isAgreePolicy, setIsAgreePolicy] = useState(true);
  const [verifyTimeout, setVerifyTimeout] = useState();
  const [isWaiting, setIsWaiting] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

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

  const handleRedirectToLoginPage = () => {
    navigate('/login', { replace: true });
  };

  const _handleSubmit = () => {
    setErrorMessage();

    if (!isAgreePolicy) {
      setErrorMessage('Please confirm that you have read and understood the Privacy Policy');
      return;
    }

    setIsLoading(true);

    const birth_date = `${birthDate.year}-${birthDate.month}-${birthDate.day}`;

    // set configurations
    const configuration = {
      method: 'post',
      url: 'http://localhost:5000/auth/register',
      data: {
        email_address: emailAddress,
        password: password,
        birth_date: birth_date,
      },
    };

    axios(configuration)
      .then((result) => {
        setStatus(1);
        setVerifyTimeout(10);
        handleSetTimeout();
        setIsWaiting(true);
      })
      .catch((error) => {
        if (error.response.data.message === 'User_Existed') {
          setErrorMessage('This Email Is Already Exists');
        }
        if (error.response.data.message === 'YOU ARE NOT OLD ENOUGH') {
          setErrorMessage('You Are Not Old Enough');
        }
        clearInterval(refInterval.current);
        setStatus(0);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const { handleBlur, handleChange, setValues, errors, handleSubmit } = useForm(_handleSubmit);

  useEffect(() => {
    setValues({
      email: { val: emailAddress, is_required: true },
      password: { val: password, is_required: true },
      confirm_password: { val: confirmPassword, is_required: true },
      birth_date: { val: birthDate.year, is_required: true },
    });
  }, []);

  return (
    <div className={cx('wrapper')}>
      <div className={cx('container')}>
        <div className={cx('bg-image')}></div>
        <div className={cx('log-in-content')}>
          <div className={cx('header')}>
            <h2 className={cx('header-title')}>Sign Up</h2>
            {isLoading && <LoadingSpinner large thin />}
            <button className={cx('sign-in-btn')} onClick={handleRedirectToLoginPage}>
              Sign In
              <RightShiftArrowIcon width="2.1rem" height="2.1rem" className={cx('right-arrow-icon')} />
            </button>
          </div>
          <div className={cx('log-in-form')}>
            <InputItem
              lable_title={'EMAIL'}
              placeholder={'Email Address...'}
              value={emailAddress}
              name="email"
              type="email"
              onChange={(e) => {
                handleChange(e);
                setEmailAddress(e.target.value);
              }}
              input_type="input"
              error={errors.email}
              onBlur={handleBlur}
            />

            <InputItem
              lable_title={'PASSWORD'}
              placeholder={'Password...'}
              value={password}
              name="password"
              type="password"
              onChange={(e) => {
                handleChange(e);
                setPassword(e.target.value);
              }}
              input_type="input"
              error={errors.password}
              onBlur={handleBlur}
            />
            <InputItem
              lable_title={'CONFIRM PASSWORD'}
              placeholder={'Confirm password...'}
              value={confirmPassword}
              name="confirm_password"
              type="password"
              onChange={(e) => {
                handleChange(e);
                setConfirmPassword(e.target.value);
              }}
              input_type="input"
              error={errors.confirm_password}
              onBlur={handleBlur}
            />
            <div className={cx('birth-date-area')}>
              <h4 className={cx('input-lable')}>BIRTHDATE</h4>
              <MyDatePicker
                className={cx('birth-date-picker', { 'error-field': errors?.birth_date })}
                selectedDay={birthDate}
                setSelectedDay={(e) => {
                  const event = {
                    target: {
                      name: 'birth_date',
                      value: e.year,
                    },
                  };
                  handleChange(event);
                  setBirthDate(e);
                }}
              />
              {errors.birth_date && <p className={cx('message-invalid')}>{errors.birth_date}</p>}
            </div>
          </div>
          <div className={cx('footer')}>
            <div className={cx('agree-terms-btn')} onClick={() => setIsAgreePolicy((prev) => !prev)}>
              {isAgreePolicy ? (
                <TickBoxIcon className={cx('check-box-icon')} height="2.2rem" width="2.2rem" />
              ) : (
                <UnCheckTickBox className={cx('check-box-icon')} height="2.2rem" width="2.2rem" />
              )}
              <p className={cx('agree-terms-title')}>I Agree To The Terms Of User</p>
            </div>
            {errorMessage && <div className={cx('error-message')}>{errorMessage}</div>}

            <button className={cx('submit-btn')} onClick={handleSubmit}>
              Sign Up
            </button>

            {isWaiting && (
              <div className={cx('status')}>
                {(!verifyTimeout || !status) && (
                  <button className={cx('resend-btn')} onClick={handleSubmit}>
                    ReSend Code
                  </button>
                )}
                {verifyTimeout ? (
                  <p className={cx('status-title')}>
                    {status ? 'Verification code is effective in...' : 'Verify Failed!'}
                  </p>
                ) : (
                  ''
                )}
                {status ? <LoadingSpinner large thin time_out={verifyTimeout} /> : ''}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
