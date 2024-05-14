import classNames from 'classnames/bind';
import { CloseIcon, PictureIcon } from '../Icons';
import styles from './MediaViewModal.module.scss';
import { useContext, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import { MediaPreviewContext } from '~/Context/MediaPreviewContext';
import MediaItem from '../MediaItem/MediaItem';
import MediaItem3 from '../MediaItem3/MediaItem3';
import MediaItem2 from '../MediaItem2/MediaItem2';

const cx = classNames.bind(styles);

function MediaViewModal({ setMediaView, mediaView, media, className }) {
  // USE_CONTEXT
  const mediaPreviewContext = useContext(MediaPreviewContext);
  const mediaPreview = mediaPreviewContext.mediaPreview;
  const setMediaPreview = mediaPreviewContext.setMediaPreview;

  // USE_STATE
  const [currentMedia, setCurrentMedia] = useState(mediaView);

  return (
    <div className={cx('wrapper', { [className]: className })} onClick={() => setMediaPreview()}>
      <div className={cx('container')}>
        <div className={cx('body')}>
          <div className={cx('body-container')} onClick={(e) => e.stopPropagation()}>
            {currentMedia.type === 'video' ? (
              // <video className={cx('video-content')} controls>
              //   <source src={currentMedia.url} type="video/mp4" />
              //   Something wents wrong!
              // </video>

              <MediaItem3
                item={{ url: currentMedia.url, type: 'video' }}
                max_height={700}
                max_width={900}
                border_radius={10}
                _styles={{
                  boxShadow: 'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px',
                }}
                controls={true}
                className={cx('media-item')}
              />
            ) : (
              // <img className={cx('image-content')} src={currentMedia.url} alt="img" />
              <MediaItem3
                item={{ url: currentMedia.url, type: 'image' }}
                max_height={700}
                max_width={900}
                border_radius={10}
                _styles={{
                  boxShadow: 'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px',
                }}
                className={cx('image-content')}
              />
            )}
          </div>
        </div>
        <div className={cx('media-container')} onClick={(e) => e.stopPropagation()}>
          <div className={cx('header')}>
            <h3 className={cx('header-title')}>Photo/Video</h3>
            <button className={cx('close-btn')} onClick={() => setMediaPreview()}>
              <CloseIcon height="3rem" width="3rem" />
            </button>
          </div>
          <ul className={cx('media-list')}>
            {media?.map((item, ind) => {
              if (item.type === 'image') {
                return (
                  <MediaItem2
                    item={{ url: item.url, type: 'image' }}
                    width={120}
                    height={120}
                    border_radius={10}
                    _styles={{
                      boxShadow: 'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px',
                    }}
                    className={cx('media-item', { check: item.media_id == currentMedia.media_id })}
                    onClick={() => {
                      setCurrentMedia({ media_id: item.media_id, url: item.url, type: 'image' });
                    }}
                  />
                );
              } else if (item.type === 'video') {
                return (
                  <MediaItem2
                    item={{ url: item.url, type: 'video' }}
                    width={120}
                    height={120}
                    border_radius={10}
                    _styles={{
                      boxShadow: 'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px',
                    }}
                    className={cx('media-item', { check: item.media_id == currentMedia.media_id })}
                    onClick={() => {
                      setCurrentMedia({ media_id: item.media_id, url: item.url, type: 'video' });
                    }}
                  />
                );
              }
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default MediaViewModal;
