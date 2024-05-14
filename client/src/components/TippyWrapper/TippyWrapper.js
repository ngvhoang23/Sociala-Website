import classNames from 'classnames/bind';
import styles from './TippyWrapper.module.scss';

const cx = classNames.bind(styles);

function TippyWrapper({ _ref, className, children, onClick }) {
  return (
    <div ref={_ref} className={cx('wrapper', { [className]: className })} onClick={onClick}>
      {children}
    </div>
  );
}

export default TippyWrapper;
