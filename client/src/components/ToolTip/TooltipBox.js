import classNames from 'classnames/bind';
import styles from './ToolTip.module.scss';

const cx = classNames.bind(styles);

function TooltipBox({ position, children }) {
  return <div className={cx('tool-tip-box', { [position]: position })}>{children}</div>;
}

export default TooltipBox;
