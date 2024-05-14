import classNames from 'classnames/bind';
import styles from './MediaLayout.module.scss';
import { useEffect, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import { CloseIcon } from '~/components/Icons';
import { isImage, isVideo } from '~/UserDefinedFunctions';
import MediaItem from '~/components/MediaItem/MediaItem';

const cx = classNames.bind(styles);

function MediaLayout({ files, setMedia }) {
  // USE_STATE

  // USE_EFFECT

  // FUNCTION_HANDLER

  const handleRemoveMediaItem = (file_id) => {
    setMedia((prev) => prev.filter((file) => file.file_id != file_id));
  };

  return (
    <div className={cx('wrapper')}>
      <div className={cx('media-content')}>
        {files?.map((file, index) => {
          if (file.type == 'image' || isImage(file.name)) {
            return (
              <MediaItem
                className={cx('media-item')}
                key={index}
                type="image"
                src={file.url || URL.createObjectURL(file)}
                removable
                onRemove={() => handleRemoveMediaItem(file.file_id)}
              />
            );
          } else if (file.type == 'video' || isVideo(file.name)) {
            return (
              <MediaItem
                className={cx('media-item')}
                key={index}
                type="video"
                src={file.url || URL.createObjectURL(file)}
                removable
                onRemove={() => handleRemoveMediaItem(file.file_id)}
              />
            );
          }
        })}
      </div>
    </div>
  );
}

export default MediaLayout;
