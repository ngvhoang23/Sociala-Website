import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './MediaItem3.module.scss';

const cx = classNames.bind(styles);

function MediaItem3({
  item,
  onClick,
  border_radius = 0,
  _styles,
  className,
  _ref_video,
  muted,
  autoPlay,
  controls,
  max_width,
  max_height,
}) {
  const [i1, setI1] = useState();

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const _d = getD(i1);

    let _width = _d.width;
    let _height = _d.height;

    setWidth(_width);
    setHeight(_height);
  }, [i1]);

  const getD = (i) => {
    let ratio = i?.width / i?.height;

    const height = i?.height;
    const width = i?.width;

    const h_ratio = height / max_height;
    const w_ratio = width / max_width;

    let _d = { width: 0, height: 0 };

    if (height > max_height || width > max_width) {
      if (h_ratio > w_ratio) {
        _d.height = max_height;
        _d.width = ratio * _d.height;
      } else {
        _d.width = max_width;
        _d.height = _d.width / ratio;
      }
    } else {
      _d.width = width;
      _d.height = height;
    }

    return _d;
  };

  const renderMediaItem = (item, i) => {
    const _d = getD(i);

    let _width = _d.width;
    let _height = _d.height;

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
          ref={_ref_video}
          className={cx('five-item-media-item', 'video-item')}
          key={item.url}
          controls={controls}
          muted={muted}
          autoPlay={autoPlay}
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

  const getVideoDimensionsOf = (url) => {
    return new Promise((resolve) => {
      // create the video element
      const video = document.createElement('video');

      // place a listener on it
      video.addEventListener(
        'loadedmetadata',
        function () {
          // retrieve dimensions
          const height = this.videoHeight;
          const width = this.videoWidth;

          // send back result
          resolve({ height, width });
        },
        false,
      );

      // start download meta-datas
      video.src = url;
    });
  };

  useEffect(() => {
    if (item.type == 'video') {
      getVideoDimensionsOf(item.url).then((result) => {
        setI1(result);
      });
    } else {
      getDemension(item.url).then((result) => {
        setI1(result);
      });
    }
  }, [item?.url]);

  return (
    <div
      className={cx('photo-item-wrapper', className)}
      style={{ width: `${width}px`, height: `${height}px`, borderRadius: `${border_radius}px`, ..._styles }}
    >
      {renderMediaItem(item, i1)}
    </div>
  );
}

export default MediaItem3;
