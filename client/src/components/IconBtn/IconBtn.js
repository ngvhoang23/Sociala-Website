import classNames from 'classnames/bind';
import styles from './IconBtn.module.scss';

const cx = classNames.bind(styles);

function IconBtn({ icon, title, medium, small, className, onClick }) {
  return (
    <button className={cx('wrapper', { medium: medium, [className]: className, small: small })} onClick={onClick}>
      <div className={cx('icon')}>{icon}</div>
      <p className={cx('title')}>{title}</p>
    </button>
  );
}

export default IconBtn;
