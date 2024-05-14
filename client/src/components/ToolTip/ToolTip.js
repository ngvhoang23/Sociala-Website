import classNames from 'classnames/bind';
import styles from './ToolTip.module.scss';
import { useEffect, useRef, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import ToolTipTarget from './ToolTipTarget';
import CenterContainer from './CenterContainer';
import TooltipBox from './TooltipBox';

const cx = classNames.bind(styles);

function ToolTip({ position, tippy, children }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const targetRef = useRef(null);
  const showTooltip = true; //isHovered || isFocused;

  const handleClick = (e) => {
    e.preventDefault();
    if (targetRef.current) {
      targetRef.current.blur();
    }
  };
  const targetElement = useRef();

  //   useEffect(() => {
  //     const observer = new IntersectionObserver((entries, observer) => {
  //       const entry = entries[0];
  //       console.log('entry', entry);
  //     });
  //     observer.observe(targetElement.current);
  //   }, []);

  return (
    <>
      <div className={cx('wrapper')}>
        <ToolTipTarget
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onClick={handleClick}
          // ref={targetRef}
          showOnFocus={isFocused}
        >
          {children}

          {/* {showTooltip && (
            <CenterContainer position={position}>
              <TooltipBox position={position}>{tippy}</TooltipBox>
            </CenterContainer>
          )} */}
        </ToolTipTarget>

        <div
          style={{
            zIndex: 9999,
            position: 'absolute',
            inset: 'auto auto 0px 0px',
            margin: '0px',
            transform: 'translate3d(437.6px, -138.4px, 0px)',
          }}
        >
          <div>hey i'm here</div>
          <div className="box" tabIndex="-1" data-placement="top-start"></div>
        </div>
      </div>
    </>
  );
}

export default ToolTip;
