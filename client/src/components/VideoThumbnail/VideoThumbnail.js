import classNames from 'classnames/bind';
import { useEffect, useRef, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import styles from './VideoThumbnail.module.scss';

const cx = classNames.bind(styles);

function VideoThumbnail({ url }) {
  const [thumbnail, setThumbnail] = useState('');

  const video = useRef(null);

  useEffect(() => {
    video.current.addEventListener('play', () => {
      video.current.crossOrigin = 'anonymous';
      const canvas = document.createElement('canvas');
      canvas.width = video.current.videoWidth;
      canvas.height = video.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video.current, 0, 0, canvas.width, canvas.height);
      setThumbnail(canvas.toDataURL());
    });
  }, [url, video]);

  return (
    <div>
      <video ref={video} className={cx('video-content')} controls>
        <source src={url} type="video/mp4" />
        Something wents wrong!
      </video>
      <img src={thumbnail} alt="Video thumbnail" />
    </div>
  );
}

export default VideoThumbnail;
