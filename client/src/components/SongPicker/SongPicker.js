import classNames from 'classnames/bind';
import styles from './SongPicker.module.scss';
import SongItem from '../SongItem';
import { useEffect, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';

const cx = classNames.bind(styles);

function SongPicker({ songs, children, onClose, setPickedSong, setIsOpenSongPicker, className }) {
  // USE_STATE
  const [playingSong, setPlayingSong] = useState();

  return (
    <div className={cx('wrapper', { [className]: className })}>
      <div className={cx('container')}>
        {songs.map((song) => {
          return (
            <SongItem
              key={song.song_id}
              song_name={song.song_name}
              singer_name={song.singer_name}
              song_img={song.song_img_url}
              song_url={song.url}
              className={cx('song-item')}
              playing={playingSong?.song_id == song.song_id}
              onClick={() => {
                setPickedSong(song);
              }}
              onPlay={() => {
                setPlayingSong((prev) => {
                  if (prev?.song_id == song.song_id) {
                    return undefined;
                  } else {
                    return song;
                  }
                });
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

export default SongPicker;
