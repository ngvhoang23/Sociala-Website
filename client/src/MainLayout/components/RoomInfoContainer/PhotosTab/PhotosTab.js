import classNames from 'classnames/bind';
import styles from './PhotosTab.module.scss';
import RoomInfoHeader from '../RoomInfoSide/RoomInfoHeader';
import { LeftArrowIcon, PhotoIcon } from '~/components/Icons';
import { useContext, useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';
import MediaItem from '~/components/MediaItem/MediaItem';
import { MediaPreviewContext } from '~/Context/MediaPreviewContext';
import { CurrentMediaPreviewContext } from '~/Context/CurrentMediaPreviewContext';
import TabLayout from '../TabLayout/TabLayout';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import { AxiosInstanceContext } from '~/components/AxiosInterceptorWrapper/AxiosInterceptorWrapper';
import MediaItem2 from '~/components/MediaItem2/MediaItem2';

const cx = classNames.bind(styles);
const cookies = new Cookies();

function PhotosTab({ room_id, setCurrentTab }) {
  const userInfoContext = useContext(UserInfoContext);
  const user = userInfoContext.user;

  //USE_CONTEXT
  const mediaPreviewContext = useContext(MediaPreviewContext);
  const mediaPreview = mediaPreviewContext.mediaPreview;
  const setMediaPreview = mediaPreviewContext.setMediaPreview;

  const axiosInstanceContext = useContext(AxiosInstanceContext);
  const axiosInstance = axiosInstanceContext;

  // USE_STATE
  const [media, setMedia] = useState([]);
  const [currentMediaView, setCurrentMediaView] = useState(false);

  //USE_EFFECT
  useEffect(() => {
    const params = {
      room_id,
    };

    const configurations = {
      params: params,
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };

    room_id &&
      axiosInstance
        .get(`/message-datas/media/${room_id}`, configurations)
        .then((result) => {
          setMedia(result.data);
        })
        .catch((error) => {
          console.log(error);
        });
  }, [room_id]);

  const handleGetMedia = (currentMediaView) => {
    const params = {
      room_id: room_id,
    };

    const configurations = {
      params: params,
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };

    room_id &&
      axiosInstance
        .get(`/message-datas/media/${room_id}`, configurations)
        .then((result) => {
          setMedia(result.data);
          setMediaPreview({
            media: result.data,
            currentMediaView: currentMediaView,
            setCurrentMediaView: setCurrentMediaView,
          });
        })
        .catch((error) => {
          console.log(error);
        });
  };

  return (
    <TabLayout
      icon={<PhotoIcon className={cx('photo-icon')} />}
      header_title={'Photos/Videos'}
      onClose={() => setCurrentTab()}
    >
      {media?.map((item) => {
        if (item.type === 'image') {
          return (
            <MediaItem2
              key={item.media_id}
              item={{ url: item.url, type: 'image' }}
              width={120}
              height={120}
              border_radius={10}
              _styles={{
                boxShadow: 'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px',
              }}
              className={cx('media-item')}
              onClick={() => {
                if (item.type == 'image' || item.type == 'video') {
                  const currentMediaView = { media_id: item.media_id, url: item.url, type: item.type };
                  handleGetMedia(currentMediaView);
                }
              }}
            />
          );
        } else if (item.type === 'video') {
          return (
            <MediaItem2
              key={item.media_id}
              item={{ url: item.url, type: 'video' }}
              width={120}
              height={120}
              border_radius={10}
              _styles={{
                boxShadow: 'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px',
              }}
              className={cx('media-item')}
              onClick={() => {
                if (item.type == 'image' || item.type == 'video') {
                  const currentMediaView = { media_id: item.media_id, url: item.url, type: item.type };
                  handleGetMedia(currentMediaView);
                }
              }}
            />
          );
        }
      })}
    </TabLayout>
  );
}

export default PhotosTab;
