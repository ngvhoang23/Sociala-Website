import classNames from 'classnames/bind';
import styles from './ProgressBar.module.scss';

const cx = classNames.bind(styles);

function ProgressBar({ is_done, className, progress }) {
  return (
    <div className={cx('wrapper', { [className]: className })}>
      <div className={cx('container')} style={{ width: `${is_done ? 100 : progress ? progress : 0}%` }}></div>
    </div>
  );
}

export default ProgressBar;
