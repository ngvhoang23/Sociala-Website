import classNames from 'classnames/bind';
import styles from './DocLayout.module.scss';
import { FileIcon } from '../Icons';
import { formatFileSize } from '~/UserDefinedFunctions';
import axios from 'axios';
import FileItem from '../FileItem';

const cx = classNames.bind(styles);

function DocLayout({ files, onClickItem, className }) {
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
  return (
    <div className={cx('wrapper', { [className]: className })}>
      <div className={cx('doc-content')}>
        {files?.map((file, index) => (
          <FileItem
            key={file.file_id}
            className={cx('doc-item')}
            file_name={file.file_name}
            file_size={file.file_size}
            file_url={file.url}
          />
        ))}
      </div>
    </div>
  );
}

export default DocLayout;
