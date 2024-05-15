import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './PhotosTab.module.scss';

const cx = classNames.bind(styles);

function MediaItem({ item, onClick, width, height, border_radius = 0, _styles }) {
  const [i1, setI1] = useState();

  const renderMediaItem = (item, i) => {
    let _width = width;
    let _height = height;

    let _width_ratio = i?.width / _width;
    let _height_ratio = i?.height / _height;

    let style;

    if (_width_ratio < _height_ratio) {
      style = {
        width: i?.width >= _width ? '100%' : 'auto',
        height: i?.height >= _height && i?.width < _width ? '100%' : 'auto',
      };
      if (i?.width < _width) {
        if (i?.height >= _height) {
          style = {
            height: i?.height >= _height ? '100%' : 'auto',
            width: i?.width >= _width && i?.height < _height ? '100%' : 'auto',
          };
        }
      }
    } else {
      style = {
        height: i?.height >= _height ? '100%' : 'auto',
        width: i?.width >= _width && i?.height < _height ? '100%' : 'auto',
      };
      if (i?.height < _height) {
        if (i?.width >= _width) {
          style = {
            width: i?.width >= _width ? '100%' : 'auto',
            height: i?.height >= _height && i?.width < _width ? '100%' : 'auto',
          };
        }
      }
    }

    if (item.type === 'image') {
      return <img className={cx('five-item-media-item')} src={item.url} style={{ ...style }} />;
    } else if (item.type === 'video') {
      return (
        <video
          className={cx('five-item-media-item', 'video-item')}
          controls
          muted
          style={{
            width: '100%',
            height: '100%',
          }}
        >
          <source src={item.url} type="video/mp4" />
          Something wents wrong!
        </video>
      );
    }
  };

  const getDemension = (src) => {
    let width, height;

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = function () {
        width = this.width;
        height = this.height;
        resolve({ width: width, height: height });
      };
      img.src = src;
    });
  };

  useEffect(() => {
    getDemension(item.url).then((result) => {
      setI1(result);
    });
  }, [item?.url]);

  return (
    <div
      className={cx('photo-item-wrapper')}
      style={{ width: `${width}px`, height: `${height}px`, borderRadius: `${border_radius}px`, ..._styles }}
    >
      {renderMediaItem(item, i1)}
    </div>
  );
}

export default MediaItem;
