import classNames from 'classnames/bind';
import styles from './FileItem.module.scss';
import { CloseIcon, DocumentIcon, ExcelIcon, FileIcon, PowerpointIcon, WordIcon } from '../Icons';
import { formatFileSize } from '~/UserDefinedFunctions';
import { useEffect, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import axios from 'axios';

const cx = classNames.bind(styles);

function FileItem({ file_name, file_size, file_url, removable, className, onRemove, small, onClick, mini }) {
  // USE_STATE
  const [fileType, setFileType] = useState('');

  // USE_EFFECT
  useEffect(() => {
    var ext = getExtension(file_name);
    setFileType(ext.toLowerCase());
  }, [file_name]);

  // FUNCTION_HANDLER
  const getExtension = (filename) => {
    var parts = filename?.split('.');
    return parts[parts.length - 1];
  };

  const handleDownLoadFile = (url, file_name) => {
    if (!url || !file_name) {
      return;
    }
    axios.get(url, { responseType: 'blob' }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file_name);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    });
  };

  const renderIcon = (ext) => {
    switch (ext.toLowerCase()) {
      case 'docx':
        return <WordIcon className={cx('office-icon')} width={'3.8rem'} height={'3.8rem'} />;
      case 'xlsx':
        return <ExcelIcon className={cx('office-icon')} width={'3.8rem'} height={'3.8rem'} />;
      case 'pptx':
        return <PowerpointIcon className={cx('office-icon')} width={'3.8rem'} height={'3.8rem'} />;
      default:
        return <DocumentIcon className={cx('office-icon')} width={'3.8rem'} height={'3.8rem'} />;
    }
  };

  return (
    <div
      className={cx('wrapper', { [className]: className }, { small: small }, { mini: mini })}
      onClick={() => {
        handleDownLoadFile(file_url, file_name);
        onClick && onClick();
      }}
    >
      {removable && (
        <button
          className={cx('remove-btn')}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <CloseIcon width="2rem" height="2rem" />
        </button>
      )}
      <span className={cx('doc-icon')}>{renderIcon(fileType)}</span>

      <div className={cx('doc-info')}>
        <p className={cx('doc-name')}>{file_name}</p>
        <p className={cx('doc-size')}>{formatFileSize(file_size)}</p>
      </div>
    </div>
  );
}

export default FileItem;
