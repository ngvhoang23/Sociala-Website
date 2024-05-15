import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import { memo, useContext, useEffect, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import { EllipsisIcon, EllipsisVerticalIcon, ThreeDotIcon } from '../Icons';
import OptionMenu from '../OptionMenu';
import OptionItem from '../OptionItem';
import styles from './DropDownMenu.module.scss';
import { useRef } from 'react';
import useOutsideAlerter from '~/hooks/useOutsideAlerter';

const cx = classNames.bind(styles);

function DropDownMenu({ header, ellipsis, className, children, onClick }) {
  // USE_REF
  const optionMenuRef = useRef(null);

  // USEOUTSIDEALERTER
  useOutsideAlerter(optionMenuRef, () => {
    setIsVisible(false);
  });

  // USE_CONTEXT

  // USE_STATE
  const [isVisible, setIsVisible] = useState(false);

  // USE_EFFECT

  return (
    <div
      className={cx('drop-down-container', { ellipsis: ellipsis, [className]: className })}
      ref={optionMenuRef}
      onClick={onClick}
    >
      <button
        className={cx('drop-down-btn')}
        onClick={(e) => {
          e.stopPropagation();
          setIsVisible((prev) => !prev);
        }}
      >
        {!ellipsis ? (
          <>
            <p>{header}</p>
            <FontAwesomeIcon icon={faAngleDown} />
          </>
        ) : (
          <ThreeDotIcon className={cx('ellipsis-icon')} width={'2rem'} height={'2rem'} />
        )}
      </button>

      {isVisible && (
        <span>
          <OptionMenu className={cx('drop-down-menu')} onClick={() => setIsVisible(false)}>
            {children}
          </OptionMenu>
        </span>
      )}
    </div>
  );
}

export default memo(DropDownMenu);
