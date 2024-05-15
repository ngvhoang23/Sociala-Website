import axios from 'axios';
import classNames from 'classnames/bind';
import styles from './EditProfileModal.module.scss';
import moment from 'moment';
import { useContext, useEffect, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import Cookies from 'universal-cookie';

import AccountItem from '../AccountItem';
import Button from '../Button';
import { CloseIcon, SearchIcon, TickBoxIcon, UnCheckTickBox } from '../Icons';
import { createId } from '~/UserDefinedFunctions';
import { ContactsContext } from '~/Context/ContactsContext';
import { CurrentRoomContext } from '~/Context/CurrentRoomContext';
import { MessagesContext } from '~/Context/MessagesContext';
import { RoomStateContext } from '~/Context/RoomStateContext';
import { SocketContext } from '~/Context/SocketContext';
import OnlineContactItem from '../OnlineContactItem';
import { AxiosInstanceContext } from '../AxiosInterceptorWrapper/AxiosInterceptorWrapper';
import ImageUploader from './ImageUploader';
import InputItem from '../InputItem';
import useForm from '~/hooks/useForm';
import CheckBoxInput from '../CheckBoxInput';
import MyDatePicker from '../MyDatePicker';
import { IsLoadingContext } from '~/Context/IsLoadingContext';

const cx = classNames.bind(styles);
const cookies = new Cookies();

function EditProfileModal({ onClose }) {
  const userInfoContext = useContext(UserInfoContext);
  const {
    user_id,
    user_avatar,
    background_image,
    birth_date,
    gender: _gender,
    first_name,
    last_name,
  } = userInfoContext.user;
  const setUser = userInfoContext.setUser;

  // USE_CONTEXT
  const axiosInstanceContext = useContext(AxiosInstanceContext);
  const axiosInstance = axiosInstanceContext;

  const isLoadingContext = useContext(IsLoadingContext);
  const isLoading = isLoadingContext.isLoading;
  const setIsLoading = isLoadingContext.setIsLoading;

  // USE_STATE
  const [avatar, setAvatar] = useState();
  const [bgImg, setBgImg] = useState();
  const [firstName, setFirstName] = useState(first_name);
  const [lastName, setLastName] = useState(last_name);
  const [gender, setGender] = useState(_gender);
  const [birthdate, setBirthdate] = useState(
    birth_date
      ? {
          day: Number(birth_date.split('-')[2]),
          month: Number(birth_date.split('-')[1]),
          year: Number(birth_date.split('-')[0]),
        }
      : { day: 1, month: 1, year: 2020 },
  );

  // USE_EFFECT
  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };

    axiosInstance
      .get(`/users/suggested-users`, config)
      .then((result) => {})
      .catch((error) => {
        error = new Error();
      });
  }, []);

  const _handleSubmit = () => {
    setIsLoading(true);

    const formData = new FormData();

    avatar && formData.append('user_avatar', avatar);
    bgImg && formData.append('background_image', bgImg);
    formData.append('first_name', firstName);
    formData.append('last_name', lastName);
    formData.append('gender', gender);
    formData.append('birth_date', `${birthdate.year}-${birthdate.month}-${birthdate.day}`);

    const config = {
      headers: { 'content-type': 'multipart/form-data', Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}` },
    };

    axiosInstance
      .put(`/users/user-info/${user_id}`, formData, config)
      .then((result) => {
        window.location.reload(false);
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const { handleChange, handleBlur, setValues, errors, handleSubmit } = useForm(_handleSubmit);

  useEffect(() => {
    setValues({
      first_name: { val: firstName },
      last_name: { val: lastName },
      birth_date: { val: birthdate.year, is_required: true },
    });
  }, []);

  return (
    <div className={cx('wrapper')} onClick={onClose}>
      <div className={cx('container')} onClick={(e) => e.stopPropagation()}>
        <div className={cx('header')}>
          <h3>Edit Profile</h3>
          <button className={cx('close-btn')} height={'2.2rem'} onClick={onClose}>
            <CloseIcon width={'2.4rem'} height="2.4rem" />
          </button>
        </div>

        <div className={cx('body')}>
          <ImageUploader
            value={avatar}
            setValue={setAvatar}
            header_title={'Profile picture'}
            img_src={user_avatar}
            img_styles={{
              width: '168px',
              height: '168px',
              borderRadius: '50%',
              border: '4px solid #fff',
              boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
            }}
          />

          <ImageUploader
            value={bgImg}
            setValue={setBgImg}
            header_title={'Cover photo'}
            img_src={background_image}
            img_styles={{
              maxWidth: '100%',
              height: '380px',
              borderRadius: '10px',
              border: '4px solid #fff',
            }}
          />

          <div className={cx('header')}>
            <h3>Other</h3>
          </div>
          <div className={cx('other-info')}>
            <InputItem
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
              value={firstName}
              error={errors.first_name}
            />
            <InputItem
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
              value={lastName}
              error={errors.last_name}
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

            <div className={cx('birth-date-area')}>
              <h4 className={cx('input-lable')}>BIRTHDATE</h4>
              <MyDatePicker
                className={cx('birth-date-picker', { 'error-field': errors?.birth_date })}
                selectedDay={birthdate}
                setSelectedDay={(e) => {
                  const event = {
                    target: {
                      name: 'birth_date',
                      value: e.year,
                    },
                  };
                  handleChange(event);
                  setBirthdate(e);
                }}
              />
              {errors.birth_date && <p className={cx('message-invalid')}>{errors.birth_date}</p>}
            </div>
          </div>
        </div>
        <div className={cx('footer')}>
          <button className={cx('cancel-btn')} onClick={onClose}>
            Cancel
          </button>
          <button className={cx('submit-btn')} onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditProfileModal;
