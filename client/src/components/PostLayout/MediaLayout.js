import classNames from 'classnames/bind';
import styles from './MediaLayout.module.scss';
import { useContext, useEffect, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FileIcon } from '../Icons';
import { formatFileSize } from '~/UserDefinedFunctions';
import MediaViewModal from '../MediaViewModal';
import MediaItem from '../MediaItem/MediaItem';
import { CurrentMediaPreviewContext } from '~/Context/CurrentMediaPreviewContext';
import Photogrid from 'react-facebook-photo-grid';
import MediaGrid1Item from '../MediaGrid/MediaGrid1Item';
import MediaGrid3Item from '../MediaGrid/MediaGrid3Item';
import MediaGrid2Item from '../MediaGrid/MediaGrid2Item';
import MediaGrid4Item from '../MediaGrid/MediaGrid4Item';
import MediaGrid5Item from '../MediaGrid/MediaGrid5Item';
import MediaGrid6Item from '../MediaGrid/MediaGrid6Item';

const cx = classNames.bind(styles);

function MediaLayout({ post_id, files }) {
  //USE_CONTEXT
  const currentMediaPreviewContext = useContext(CurrentMediaPreviewContext);
  const currentMediaPreview = currentMediaPreviewContext.currentMediaPreview;
  const setCurrentMediaPreview = currentMediaPreviewContext.setCurrentMediaPreview;

  // USE_STATE
  const [post_media_data, set_post_media_data] = useState([]);
  const [mediaView, setMediaView] = useState();
  const [data, setData] = useState();

  // USE_EFFECT
  useEffect(() => {
    const post_media_data = [];
    files.forEach((file, index) => {
      if (index > 5) {
        return;
      }
      post_media_data.push({ url: file.url, id: file.file_id });
    });
    set_post_media_data(post_media_data);
  }, []);

  const handlePostPreview = (media_id) => {
    setCurrentMediaPreview({ post_id, media_id });
  };

  const renderMedia = () => {
    if (files.length === 1) {
      return (
        <MediaGrid1Item
          item1={{
            url: files[0].url,
            type: files[0].type,
            media_id: files[0].file_id,
            handlePreview: () => handlePostPreview(files[0].file_id),
          }}
        />
      );
    } else if (files.length === 2) {
      return (
        <MediaGrid2Item
          item1={{ url: files[0].url, type: files[0].type, handlePreview: () => handlePostPreview(files[0].file_id) }}
          item2={{ url: files[1].url, type: files[1].type, handlePreview: () => handlePostPreview(files[1].file_id) }}
        />
      );
    } else if (files.length === 3) {
      return (
        <MediaGrid3Item
          item1={{ url: files[0].url, type: files[0].type, handlePreview: () => handlePostPreview(files[0].file_id) }}
          item2={{ url: files[1].url, type: files[1].type, handlePreview: () => handlePostPreview(files[1].file_id) }}
          item3={{ url: files[2].url, type: files[2].type, handlePreview: () => handlePostPreview(files[2].file_id) }}
        />
      );
    } else if (files.length === 4) {
      return (
        <MediaGrid4Item
          item1={{ url: files[0].url, type: files[0].type, handlePreview: () => handlePostPreview(files[0].file_id) }}
          item2={{ url: files[1].url, type: files[1].type, handlePreview: () => handlePostPreview(files[1].file_id) }}
          item3={{ url: files[2].url, type: files[2].type, handlePreview: () => handlePostPreview(files[2].file_id) }}
          item4={{ url: files[3].url, type: files[3].type, handlePreview: () => handlePostPreview(files[3].file_id) }}
        />
      );
    } else if (files.length === 5) {
      return (
        <MediaGrid5Item
          item1={{ url: files[0].url, type: files[0].type, handlePreview: () => handlePostPreview(files[0].file_id) }}
          item2={{ url: files[1].url, type: files[1].type, handlePreview: () => handlePostPreview(files[1].file_id) }}
          item3={{ url: files[2].url, type: files[2].type, handlePreview: () => handlePostPreview(files[2].file_id) }}
          item4={{ url: files[3].url, type: files[3].type, handlePreview: () => handlePostPreview(files[3].file_id) }}
          item5={{ url: files[4].url, type: files[4].type, handlePreview: () => handlePostPreview(files[4].file_id) }}
        />
      );
    } else if (files.length >= 6) {
      return (
        <MediaGrid6Item
          item1={{ url: files[0].url, type: files[0].type, handlePreview: () => handlePostPreview(files[0].file_id) }}
          item2={{ url: files[1].url, type: files[1].type, handlePreview: () => handlePostPreview(files[1].file_id) }}
          item3={{ url: files[2].url, type: files[2].type, handlePreview: () => handlePostPreview(files[2].file_id) }}
          item4={{ url: files[3].url, type: files[3].type, handlePreview: () => handlePostPreview(files[3].file_id) }}
          item5={{ url: files[4].url, type: files[4].type, handlePreview: () => handlePostPreview(files[4].file_id) }}
          item6={{ url: files[5].url, type: files[5].type, handlePreview: () => handlePostPreview(files[5].file_id) }}
          res_media_quantity={files.length - 5}
        />
      );
    }
  };

  return <div className={cx('wrapper')}>{renderMedia()}</div>;
}

export default MediaLayout;
