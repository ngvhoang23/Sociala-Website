import classNames from 'classnames/bind';
import styles from './SwitchBtn.module.scss';

const cx = classNames.bind(styles);

function SwitchBtn() {
  return (
    <label className={cx('switch-btn')}>
      <input type="checkbox" />
      <span className={cx('slider')}></span>
    </label>
  );
}

export default SwitchBtn;
