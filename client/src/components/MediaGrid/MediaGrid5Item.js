import classNames from 'classnames/bind';
import styles from './MediaGrid.module.scss';
import { useEffect, useState } from 'react';

const cx = classNames.bind(styles);

function MediaGrid5Item({ item1, item2, item3, item4, item5 }) {
  const [flashing, setFlashing] = useState(false);

  const [i1, setI1] = useState();
  const [i2, setI2] = useState();
  const [i3, setI3] = useState();
  const [i4, setI4] = useState();
  const [i5, setI5] = useState();

  const renderMediaItem = (item, i, index) => {
    let _width = 0;
    let _height = 0;

    if (index == 1 || index == 2) {
      _width = 245;
      _height = 245;
    } else {
      _width = 163;
      _height = 163;
    }

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
      return <img className={cx('five-item-media-item')} src={item.url} style={style} />;
    } else if (item.type === 'video') {
      return (
        <video
          className={cx('five-item-media-item', 'video-item')}
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

    getDemension(item3.url).then((result) => {
      setI3(result);
    });

    getDemension(item4.url).then((result) => {
      setI4(result);
    });

    getDemension(item5.url).then((result) => {
      setI5(result);
    });
  }, [item1?.url, item2?.url, item3?.url, item4?.url, item5?.url]);

  return (
    <div className={cx('five-item-wrapper')}>
      <div
        className={cx('five-item-container', 'item1', { flash: flashing.item === 1 })}
        onClick={item1.handlePreview}
        onMouseDown={() => {
          setFlashing({ item: 1 });
        }}
        onMouseUp={() => {
          setFlashing(false);
        }}
      >
        {renderMediaItem(item1, i1, 1)}
      </div>
      <div
        className={cx('five-item-container', 'item2', { flash: flashing.item === 2 })}
        onClick={item2.handlePreview}
        onMouseDown={() => {
          setFlashing({ item: 2 });
        }}
        onMouseUp={() => {
          setFlashing(false);
        }}
      >
        {renderMediaItem(item2, i2, 2)}
      </div>
      <div
        className={cx('five-item-container', 'item3', { flash: flashing.item === 3 })}
        onClick={item3.handlePreview}
        onMouseDown={() => {
          setFlashing({ item: 3 });
        }}
        onMouseUp={() => {
          setFlashing(false);
        }}
      >
        {renderMediaItem(item3, i3, 3)}
      </div>
      <div
        className={cx('five-item-container', 'item4', { flash: flashing.item === 4 })}
        onClick={item4.handlePreview}
        onMouseDown={() => {
          setFlashing({ item: 4 });
        }}
        onMouseUp={() => {
          setFlashing(false);
        }}
      >
        {renderMediaItem(item4, i4, 4)}
      </div>
      <div
        className={cx('five-item-container', 'item5', { flash: flashing.item === 5 })}
        onClick={item5.handlePreview}
        onMouseDown={() => {
          setFlashing({ item: 5 });
        }}
        onMouseUp={() => {
          setFlashing(false);
        }}
      >
        {renderMediaItem(item5, i5, 5)}
      </div>
    </div>
  );
}

export default MediaGrid5Item;
