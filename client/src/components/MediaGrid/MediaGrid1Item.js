import classNames from 'classnames/bind';
import styles from './MediaGrid.module.scss';
import { useEffect, useState } from 'react';

const cx = classNames.bind(styles);

function MediaGrid1Item({ item1 }) {
  const [flashing, setFlashing] = useState(false);

  const [i1, setI1] = useState();

  const getDemension = () => {
    let width, height;

    const img = new Image();
    img.onload = function () {
      width = this.width;
      height = this.height;
      setI1({ width: width, height: height });
    };
    img.src = item1.url;
  };

  useEffect(() => {
    getDemension();
  }, [item1]);

  const renderMediaItem = (item, i) => {
    let _width = 492;
    let _height = 492;

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

    if (item1.type === 'image') {
      return <img className={cx('one-item-media-item')} src={item1.url} style={style} />;
    } else if (item1.type === 'video') {
      return (
        <video
          className={cx('one-item-media-item', 'video-item')}
          controls
          muted
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#f0f2f5',
          }}
        >
          <source src={item1.url} type="video/mp4" />
          Something wents wrong!
        </video>
      );
    }
  };

  return (
    <div className={cx('one-item-wrapper')}>
      <div
        className={cx('one-item-container', { flash: flashing.item === 1 })}
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
    </div>
  );
}

export default MediaGrid1Item;
