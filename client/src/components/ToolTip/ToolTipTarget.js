import classNames from 'classnames/bind';
import styles from './ToolTip.module.scss';

const cx = classNames.bind(styles);

function ToolTipTarget({ children }) {
  return <div className={cx('target')}>{children}</div>;
}

export default ToolTipTarget;
