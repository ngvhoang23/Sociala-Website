import { useContext, useRef, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import classNames from 'classnames/bind';
import styles from './UpdateProfileContainer.module.scss';
import userEvent from '@testing-library/user-event';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { AxiosInstanceContext } from '../AxiosInterceptorWrapper/AxiosInterceptorWrapper';

const cx = classNames.bind(styles);
const cookies = new Cookies();

function UpdateProfileContainer({ data, setIsOpenUpdateBox, setIsOpenPictureChanger }) {
  const userInfoContext = useContext(UserInfoContext);
  const user = userInfoContext.user;

  const axiosInstanceContext = useContext(AxiosInstanceContext);
  const axiosInstance = axiosInstanceContext;

  const inputUpload = useRef();
  const inputuser_name = useRef();

  const [avatar, setAvatar] = useState();
  const [user_name, setuser_name] = useState(user.full_name);
  const [isOpenChangeuser_nameInp, setIsOpenChangeuser_nameInp] = useState(false);

  const handleShowEditModal = () => {
    inputUpload.current.click();
  };

  const handleSaveProfile = (e) => {
    const formData = new FormData();
    avatar && formData.append('avatar', avatar);
    formData.append('user_name', user_name);
    formData.append('full_name', user.full_name);
    const config = {
      headers: { 'content-type': 'multipart/form-data', Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}` },
    };

    axiosInstance
      .post(`/users/update-user/${user.user_id}`, formData, config)
      .then((result) => {})
      .catch((error) => {
        error = new Error();
      });
    user.full_name = user_name;
    user.full_name = user.full_name;
    localStorage.setItem('USER_INFO', JSON.stringify(user));
    window.location.href = `/contacts/${user.user_id}`;
  };

  return (
    <div className={cx('wrapper')} onClick={() => setIsOpenUpdateBox(false)}>
      <div className={cx('container')} onClick={(e) => e.stopPropagation()}>
        <label className={cx('container-label')}>Edit Profile</label>
        <div className={cx('profile-content')}>
          <div className={cx('avatar-container')}>
            <label className={cx('profile-header')}>Profile Avatar</label>

            <img className={cx('avatar')} src={avatar ? URL.createObjectURL(avatar) : user.user_avatar} />

            <button className={cx('upload-btn')} onClick={handleShowEditModal}>
              Upload Photo
            </button>
            {avatar && (
              <button
                className={cx('upload-btn')}
                onClick={() => {
                  inputUpload.current.value = null;
                  setAvatar();
                }}
              >
                Cancel
              </button>
            )}
            <input
              ref={inputUpload}
              accept="image/x-png,image/gif,image/jpeg"
              className={cx('input-upload-picture')}
              type="file"
              name="upload"
              onChange={(e) => {
                setAvatar(e.target.files[0]);
              }}
            />
          </div>
          <div className={cx('profile-user-name')}>
            <label className={cx('profile-header')}>Profile User Name</label>
            <div className={cx('profile-user-name-container')}>
              {isOpenChangeuser_nameInp && (
                <div className={cx('user-name-changer')}>
                  <input
                    ref={inputuser_name}
                    value={user_name}
                    className={cx('input-user-name')}
                    type="text"
                    spellCheck="false"
                    autoFocus
                    onChange={(e) => setuser_name(e.target.value)}
                  />
                  <div className={cx('user-name-changer-btn')}>
                    <button
                      onClick={() => {
                        setuser_name(user.full_name);
                        setIsOpenChangeuser_nameInp(false);
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        setIsOpenChangeuser_nameInp(false);
                      }}
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}
              {!isOpenChangeuser_nameInp && (
                <div
                  className={cx('current-name-container')}
                  onClick={() => {
                    setIsOpenChangeuser_nameInp(true);
                  }}
                >
                  <span className={cx('current-name')}>{user_name}</span>
                  <button className={cx('change-name-btn')}>
                    <FontAwesomeIcon icon={faPencil} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <button className={cx('save-btn')} onClick={handleSaveProfile}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdateProfileContainer;
