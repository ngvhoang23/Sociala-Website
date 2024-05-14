import classNames from 'classnames/bind';
import styles from './StoryCreationModal.module.scss';
import { useEffect, useRef, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import axios from 'axios';
import Cookies from 'universal-cookie';
import moment from 'moment';
import { isImage, isVideo } from '~/UserDefinedFunctions';
import { dataURLtoFile, generateVideoThumbnails, toDataURL } from '~/UserDefinedFunctions/GenerateThumbnails';
import SongPicker from '../SongPicker';
import SongItem from '../SongItem';
import { FilledPhotoIcon, PhotoIcon } from '../Icons';

const cx = classNames.bind(styles);
const cookies = new Cookies();

function StoryCreationModal({
  uploadedMedia,
  setUploadedMedia,
  thumbnail,
  setThumbnail,
  className,
  onClick,
  setIsUploading,
}) {
  // USE_REF
  const inpUploadRef = useRef();

  // USE_STATE
  const [imageUrl, setImageUrl] = useState();
  const [videoUrl, setVideoUrl] = useState(12);

  const handleUploadMedia = (e) => {
    setIsUploading(true);

    if (e?.target?.files[0]?.size / 1000000 > 25) {
      alert('require file size less than 25MB');
      setIsUploading(false);
      return;
    }

    setVideoUrl();
    setImageUrl();
    setUploadedMedia(e.target.files[0]);
    const reader = new FileReader();
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      reader.readAsDataURL(selectedFile);
    }
    reader.onload = (readerEvent) => {
      if (selectedFile.type.includes('image')) {
        setImageUrl(readerEvent.target.result);
        setVideoUrl();
        setThumbnail(e.target.files[0]);
        setIsUploading(false);
      } else if (selectedFile.type.includes('video')) {
        setVideoUrl(readerEvent.target.result);
        setImageUrl();
        generateVideoThumbnails(selectedFile, 1)
          .then((result) => {
            toDataURL(result[0]).then((dataUrl) => {
              var fileData = dataURLtoFile(dataUrl, 'imageName.jpg');
              setThumbnail(fileData);
              setIsUploading(false);
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    };
  };

  return (
    <div
      className={cx('wrapper', 'bg-image', { 'bg-image-active': uploadedMedia }, { [className]: className })}
      onClick={(e) => {
        onClick(e);
        inpUploadRef.current.value = null;
        inpUploadRef?.current.click();
      }}
    >
      {uploadedMedia && (
        <>
          <div className={cx('uploaded-content')}>
            {videoUrl && (
              <video className={cx('uploaded-video')} autoPlay muted>
                <source src={videoUrl} type="video/mp4" />
                Something wents wrong!
              </video>
            )}

            {imageUrl && <img className={cx('uploaded-img')} src={imageUrl} alt="" />}
          </div>
        </>
      )}
      <div className={cx('container')}>
        {!uploadedMedia && (
          <div className={cx('lable')}>
            <span className={cx('photo-icon-container')}>
              <img className={cx('photo-icon')} alt="" src={require('../../assets/images/filled_photo.png')} />
            </span>
            <p className={cx('lable-title')}>Add photo/video</p>
          </div>
        )}
        <input
          type="file"
          accept=".jpg, .mp4, .png"
          className={cx('dn')}
          ref={inpUploadRef}
          onChange={handleUploadMedia}
        />
      </div>
    </div>
  );
}

export default StoryCreationModal;
