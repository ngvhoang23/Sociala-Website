import classNames from 'classnames/bind';
import styles from './LoadingModal.module.scss';
import LoadingSpinner from '../LoadingSpinner';

const cx = classNames.bind(styles);

function LoadingModal() {
  return (
    <div className={cx('wrapper')} onClick={() => console.log('object')}>
      <div className={cx('container')}>
        <LoadingSpinner large />
      </div>
    </div>
  );
}

export default LoadingModal;
