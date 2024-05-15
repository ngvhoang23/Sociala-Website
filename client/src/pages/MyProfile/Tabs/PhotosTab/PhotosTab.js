import classNames from 'classnames/bind';
import styles from './PhotosTab.module.scss';
import { SearchIcon } from '~/components/Icons';
import React, { useContext, useEffect, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';
import PostPreviewSingleMedia from '~/pages/PostPreviewSingleMedia';
import { createRoot } from 'react-dom/client';
import { RootContext } from '~/index';
import { CurrentMediaPreviewContext } from '~/Context/CurrentMediaPreviewContext';
import { AxiosInstanceContext } from '~/components/AxiosInterceptorWrapper/AxiosInterceptorWrapper';
import MediaItem from './MediaItem';
import { type } from '@testing-library/user-event/dist/type';

const cx = classNames.bind(styles);
const cookies = new Cookies();

function PhotosTab() {
  // CONSTANCE
  const userInfoContext = useContext(UserInfoContext);
  const user = userInfoContext.user;

  // USE_NAVIGATE
  const navigate = useNavigate();

  // USE_CONTEXT
  const currentMediaPreviewContext = useContext(CurrentMediaPreviewContext);
  const currentMediaPreview = currentMediaPreviewContext.currentMediaPreview;
  const setCurrentMediaPreview = currentMediaPreviewContext.setCurrentMediaPreview;

  const axiosInstanceContext = useContext(AxiosInstanceContext);
  const axiosInstance = axiosInstanceContext;

  // USE_STATE
  const [photos, setPhotos] = useState([]);

  // USE_EFFECT
  useEffect(() => {
    const params = { queried_user_id: user.user_id };

    const configurations = {
      params: params,
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };

    axiosInstance
      .get(`/posts/photos/${user.user_id}`, configurations)
      .then((result) => {
        setPhotos(result.data);
      })
      .catch((error) => {
        error = new Error();
      });
  }, []);

  return (
    <div className={cx('wrapper')}>
      <div className={cx('header')}>
        <h3 className={cx('header-title')}>Photos</h3>
        <div className={cx('tools')}>
          <button className={cx('add-photos-btn')}>Add Photos</button>
        </div>
      </div>
      <div className={cx('body')}>
        {photos.map((photo, index) => {
          console.log(photo);
          return (
            // <img
            //   key={photo.file_id}
            //   className={cx('photo-item')}
            //   alt=""
            //   src={photo.file_url}
            //   onClick={() => setCurrentMediaPreview({ post_id: photo.post_id, media_id: photo.file_id })}
            // />
            <MediaItem
              key={photo.file_id}
              item={{ url: photo.file_url, type: photo.type }}
              width={300}
              height={300}
              onClick={() => setCurrentMediaPreview({ post_id: photo.post_id, media_id: photo.file_id })}
            />
          );
        })}
      </div>
    </div>
  );
}

export default PhotosTab;
