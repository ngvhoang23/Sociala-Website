import classNames from 'classnames/bind';
import { LogOutIcon } from '../Icons';
import styles from './Button.module.scss';

const cx = classNames.bind(styles);

function Button({ className, icon, title, primary, onClick, noOuline }) {
  return (
    <button
      className={cx('wrapper', { [className]: className, primary: primary, noOuline: noOuline })}
      onClick={onClick}
    >
      {icon && <span className={cx('icon')}>{icon}</span>}
      {title && <p className={cx('title')}>{title}</p>}
    </button>
  );
}

export default Button;
