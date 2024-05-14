import classNames from 'classnames/bind';
import styles from './SongItem.module.scss';
import { PauseIcon, PausingIcon, PlayIcon, PlayingIcon } from '../Icons';
import { useEffect, useRef, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';

const cx = classNames.bind(styles);

function SongItem({
  song_id,
  song_url,
  song_name,
  singer_name,
  song_img,
  className,
  onClick,
  onPlay,
  playing,
  preview,
  small,
}) {
  // USE_REF
  const songRef = useRef();

  // USE_STATE

  // USE_EFFECT
  useEffect(() => {
    if (playing) {
      songRef?.current?.play();
    } else {
      songRef?.current?.pause();
    }
  }, [playing]);

  return (
    <div className={cx('wrapper', { [className]: className }, { small: small })} onClick={onClick}>
      <div className={cx('song-content')}>
        <img alt="" className={cx('song_img')} src={song_img} />
        <div className={cx('song-info')}>
          <h3 className={cx('song-name')}>{song_name}</h3>
          <p className={cx('author-name')}>{singer_name}</p>
        </div>
      </div>

      {!preview && (
        <audio ref={songRef} key={song_id} className={cx('audio-content')} controls>
          <source src={song_url} type="audio/ogg" />
          <source src={song_url} type="audio/mpeg" />
          Your browser does not support the audio tag.
        </audio>
      )}

      {!preview && (
        <button
          className={cx('play-btn')}
          onClick={(e) => {
            onPlay();
            e.stopPropagation();
          }}
        >
          {playing ? <PauseIcon width={'2rem'} height={'2rem'} /> : <PlayIcon width={'2rem'} height={'2rem'} />}
        </button>
      )}
    </div>
  );
}

export default SongItem;
