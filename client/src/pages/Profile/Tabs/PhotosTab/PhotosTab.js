import classNames from 'classnames/bind';
import styles from './PhotosTab.module.scss';
import { SearchIcon } from '~/components/Icons';
import { useContext, useEffect, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { useParams } from 'react-router-dom';
import { CurrentMediaPreviewContext } from '~/Context/CurrentMediaPreviewContext';
import { AxiosInstanceContext } from '~/components/AxiosInterceptorWrapper/AxiosInterceptorWrapper';

const cx = classNames.bind(styles);
const cookies = new Cookies();

function PhotosTab() {
  // CONSTANCE
  const userInfoContext = useContext(UserInfoContext);
  const user = userInfoContext.user;

  // USE_PARAMS
  const { contact_id } = useParams();

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
    const params = {
      queried_user_id: contact_id,
    };

    const configurations = {
      params: params,
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };

    axiosInstance
      .get(`/posts/photos/${contact_id}`, configurations)
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
        {photos.map((photo) => {
          return (
            <img
              key={photo.file_id}
              className={cx('photo-item')}
              alt=""
              src={photo.file_url}
              onClick={() => setCurrentMediaPreview({ post_id: photo.post_id, media_id: photo.file_id })}
            />
          );
        })}
      </div>
    </div>
  );
}

export default PhotosTab;
