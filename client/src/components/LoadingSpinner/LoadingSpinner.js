import classNames from 'classnames/bind';
import styles from './LoadingSpinner.module.scss';
import { useEffect, useRef, useState } from 'react';

const cx = classNames.bind(styles);

function LoadingSpinner({ className, large, thin, time_out, color }) {
  return (
    <div className={cx('spinner-container', { [className]: className }, { large: large }, { thin: thin })}>
      <div className={cx('loading-spinner')} style={{ borderTopColor: color }}></div>
      <div className={cx('time-out')}>{time_out}</div>
    </div>
  );
}

export default LoadingSpinner;
