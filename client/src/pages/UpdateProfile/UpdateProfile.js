import classNames from 'classnames/bind';
import styles from './UpdateProfile.module.scss';
import { useContext, useEffect, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { AxiosInstanceContext } from '~/components/AxiosInterceptorWrapper/AxiosInterceptorWrapper';
import InputItem from '~/components/InputItem';
import { TickBoxIcon, UnCheckTickBox } from '~/components/Icons';
import CheckBoxInput from '~/components/CheckBoxInput';
import useForm from '~/hooks/useForm';
import LoadingSpinner from '~/components/LoadingSpinner';
import { parseJwt } from '~/UserDefinedFunctions';

const cookies = new Cookies();
const cx = classNames.bind(styles);

function UpdateProfile() {
  const axiosInstanceContext = useContext(AxiosInstanceContext);
  const axiosInstance = axiosInstanceContext;

  const { token } = useParams();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState(1);
  const [phoneNum, setPhoneNum] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState();

  const _handleSubmit = () => {
    const userSignUpInfo = parseJwt(token);
    const birth_date = userSignUpInfo?.birth_date;

    setIsLoading(true);
    const payload = {
      first_name: firstName,
      last_name: lastName,
      gender: gender,
      phone_num: phoneNum,
      birth_date: birth_date,
    };

    const configurations = {
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };

    axiosInstance
      .post(`/users/user-info`, payload, configurations)
      .then((result) => {
        setMessage({
          status: 1,
          content: 'Complete profile successfully',
        });
        window.location.href = `/new-feeds`;
      })
      .catch((error) => {
        setMessage({
          status: 0,
          content: 'Complete profile failed',
        });
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const { handleChange, handleBlur, setValues, errors, handleSubmit } = useForm(_handleSubmit);

  useEffect(() => {
    setValues({
      first_name: { val: firstName, is_required: true },
      last_name: { val: lastName, is_required: true },
      phone_num: { val: phoneNum, is_required: false },
    });
  }, []);

  return (
    <div className={cx('wrapper')}>
      <div className={cx('container')}>
        <div className={cx('header')}>
          <h3 className={cx('header-title')}>Complete Your Profile</h3>
          <p className={cx('header-des')}>Give us more information for a personalized experience</p>
          {isLoading && <LoadingSpinner className={cx('loading-animation')} large thin />}
        </div>
        <div className={cx('form-container')}>
          <InputItem
            required
            className={cx('input-item', 'first-name')}
            placeholder={'First name ...'}
            lable_title={'FIRST NAME'}
            name="first_name"
            type="text"
            onBlur={handleBlur}
            onChange={(e) => {
              setFirstName(e.target.value);
              handleChange(e);
            }}
            input_type="input"
            error={errors.first_name}
          />
          <InputItem
            required
            className={cx('input-item', 'last-name')}
            placeholder={'Last name ...'}
            lable_title={'LAST NAME'}
            name="last_name"
            type="text"
            onBlur={handleBlur}
            onChange={(e) => {
              setLastName(e.target.value);
              handleChange(e);
            }}
            input_type="input"
            error={errors.last_name}
          />

          <InputItem
            className={cx('input-item')}
            placeholder={'Mobile phone ...'}
            lable_title={'MOBILE PHONE'}
            name="phone_num"
            onBlur={handleBlur}
            onChange={(e) => {
              setPhoneNum(e.target.value);
              handleChange(e);
            }}
            input_type="input"
            error={errors.phone_num}
          />
          <div className={cx('input-item', 'gender-input')}>
            <h4 className={cx('gender-title')}>GENDER: </h4>
            <CheckBoxInput
              className={cx('check-box-item')}
              title="Female"
              isCheck={gender === 0}
              onClick={() => setGender(0)}
            />
            <CheckBoxInput
              className={cx('check-box-item')}
              title="Male"
              isCheck={gender === 1}
              onClick={() => setGender(1)}
            />
          </div>
        </div>
        <button
          className={cx('submit-btn')}
          onClick={(event) => {
            handleSubmit(event);
          }}
        >
          Continue
        </button>

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
  );
}

export default UpdateProfile;
