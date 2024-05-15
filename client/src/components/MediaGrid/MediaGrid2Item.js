import classNames from 'classnames/bind';
import styles from './MediaGrid.module.scss';
import { useEffect, useState } from 'react';

const cx = classNames.bind(styles);

function MediaGrid2Item({ item1, item2 }) {
  const [flashing, setFlashing] = useState(false);

  const [i1, setI1] = useState();
  const [i2, setI2] = useState();

  const renderMediaItem = (item, i) => {
    let _width = 245;
    let _height = 246;

    let _width_ratio = i?.width / _width;
    let _height_ratio = i?.height / _height;

    let style;

    if (_width_ratio < _height_ratio) {
      style = {
        width: i?.width >= _width ? '100%' : 'auto',
        height: i?.height >= _height && i?.width < _width ? '100%' : 'auto',
      };
    } else {
      style = {
        height: i?.height >= _height ? '100%' : 'auto',
        width: i?.width >= _width && i?.height < _height ? '100%' : 'auto',
      };
    }

    if (item.type === 'image') {
      return <img className={cx('two-item-media-item')} src={item.url} style={style} />;
    } else if (item.type === 'video') {
      return (
        <video
          className={cx('two-item-media-item', 'video-item')}
          controls
          muted
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#f0f2f5',
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
    getDemension(item1.url).then((result) => {
      setI1(result);
    });

    getDemension(item2.url).then((result) => {
      setI2(result);
    });
  }, [item1?.url, item2?.url]);

  return (
    <div className={cx('two-item-wrapper')}>
      <div
        className={cx('two-item-container', 'item1', { flash: flashing.item === 1 })}
        onClick={item1.handlePreview}
        onMouseDown={() => {
          setFlashing({ item: 1 });
        }}
        onMouseUp={() => {
          setFlashing(false);
        }}
      >
        {renderMediaItem(item1, i1)}
      </div>
      <div
        className={cx('two-item-container', 'item2', { flash: flashing.item === 2 })}
        onClick={item2.handlePreview}
        onMouseDown={() => {
          setFlashing({ item: 2 });
        }}
        onMouseUp={() => {
          setFlashing(false);
        }}
      >
        {renderMediaItem(item2, i2)}
      </div>
    </div>
  );
}

export default MediaGrid2Item;
