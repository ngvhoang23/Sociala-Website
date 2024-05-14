import classNames from 'classnames/bind';
import styles from './EditProfileModal.module.scss';
import { useRef, useState } from 'react';

const cx = classNames.bind(styles);

function ImageUploader({ img_src, img_styles, header_title, value, setValue }) {
  const imgInpRef = useRef();

  const handleUpload = (value) => {
    setValue(value.target.files[0]);
  };

  return (
    <div className={cx('img-uploader-wrapper')}>
      <div className={cx('img-uploader-header')}>
        <h3>{header_title}</h3>
        <button onClick={() => imgInpRef?.current.click()}>Add</button>
      </div>
      <div className={cx('img-uploader-body')}>
        <img src={value ? URL.createObjectURL(value) : img_src} style={img_styles} />
      </div>
      <input ref={imgInpRef} style={{ display: 'none' }} type="file" accept=".jpg, .png" onChange={handleUpload} />
    </div>
  );
}

export default ImageUploader;
