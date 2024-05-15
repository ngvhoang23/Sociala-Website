import classNames from 'classnames/bind';
import styles from './OptionMenu.module.scss';
import { memo } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';

const cx = classNames.bind(styles);

function OptionMenu({ className, children, onClick }) {
  return (
    <div className={cx('wrapper', { [className]: className })} onClick={onClick}>
      {children}
    </div>
  );
}

export default memo(OptionMenu);
