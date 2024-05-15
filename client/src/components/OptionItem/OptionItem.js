import classNames from 'classnames/bind';
import { InfoIcon } from '../Icons';
import styles from './OptionItem.module.scss';
import { memo } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';

const cx = classNames.bind(styles);

function OptionItem({ title, icon, onClick, className }) {
  return (
    <li className={cx('wrapper', { [className]: className })} onClick={onClick}>
      {icon}
      <p>{title}</p>
    </li>
  );
}

export default memo(OptionItem);
