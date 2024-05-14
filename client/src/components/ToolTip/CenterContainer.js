import classNames from 'classnames/bind';
import styles from './ToolTip.module.scss';

const cx = classNames.bind(styles);

function CenterContainer({ position, children }) {
  return <div className={cx('center-container', { [position]: position })}>{children}</div>;
}

export default CenterContainer;
