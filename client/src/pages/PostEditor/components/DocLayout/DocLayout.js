import classNames from 'classnames/bind';
import styles from './DocLayout.module.scss';
import { CloseIcon, FileIcon } from '~/components/Icons';
import { formatFileSize } from '~/UserDefinedFunctions';
import axios from 'axios';
import FileItem from '~/components/FileItem';

const cx = classNames.bind(styles);

function DocLayout({ files, setDocs, onClickItem }) {
  const handleDownLoadFile = (url, file_name) => {
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

  const handleRemoveDocItem = (file_id) => {
    setDocs((prev) => prev.filter((file) => file.file_id != file_id));
  };

  return (
    <div className={cx('wrapper')}>
      <div className={cx('media-content')}>
        {files?.map((file, index) => (
          <div key={index} className={cx('doc-item-wrapper')}>
            <FileItem
              className={cx('doc-item')}
              file_name={file.file_name || file.name}
              file_size={file.file_size || file.size}
              file_url={file.url}
            />
            <button className={cx('remove-btn')} onClick={() => handleRemoveDocItem(file.file_id)}>
              <CloseIcon width="2.2rem" height="2.2rem" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DocLayout;
