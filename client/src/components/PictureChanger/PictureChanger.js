import { useReducer, useRef, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import classNames from 'classnames/bind';
import styles from './PictureChanger.module.scss';
import AvatarEditor from 'react-avatar-editor';
import Avatar from 'react-avatar-edit';

const cx = classNames.bind(styles);

function PictureChanger({ setIsOpenPictureChanger }) {
  const inputUpload = useRef();

  const handleUploadAvatar = () => {
    inputUpload.current.click();
  };

  return (
    <div className={cx('wrapper')} onClick={() => setIsOpenPictureChanger(false)}>
      <div className={cx('container')} onClick={(e) => e.stopPropagation()}>
        <label className={cx('container-label')}>Update profile picture</label>
        <button className={cx('upload-btn')} onClick={handleUploadAvatar}>
          Upload Photo
        </button>
        <input
          ref={inputUpload}
          className={cx('input-upload-picture')}
          type="file"
          name="upload"
          //   onChange={(e) =>
          //     setState({
          //       ...state,
          //       img: e.target.files[0],
          //     })
          //   }
        />
      </div>
    </div>
  );
}

export default PictureChanger;
