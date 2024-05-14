import classNames from 'classnames/bind';
import styles from './CreatePostModal.module.scss';

const cx = classNames.bind(styles);

function CreatePostModal() {
  return <div className={cx('wrapper')}></div>;
}

export default CreatePostModal;
