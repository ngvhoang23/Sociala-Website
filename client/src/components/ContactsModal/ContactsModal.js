import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import { useCallback, useContext, useRef, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import { useNavigate } from 'react-router-dom';
import { SearchBtnClickSignContext } from '~/Context/SearchBtnClickSignContext';
import { SearchUserValueContext } from '~/pages/SearchFriends/SearchUserValueContext';
import {
  ArrowRightIcon,
  BellIcon,
  DownArrowIcon,
  EditIcon,
  EllipsisVerticalIcon,
  RightArrowIcon,
  SaveIcon,
  SearchIcon,
  ThreeDotIcon,
  XMarkIcon,
} from '../Icons';
import OptionMenu from '../OptionMenu';
import OptionItem from '../OptionItem';
import styles from './ContactsModal.module.scss';
import DropDownMenu from '../DropDownMenu/DropDownMenu';
import useOutsideAlerter from '~/hooks/useOutsideAlerter';
import TippyWrapper from '../TippyWrapper';
import IconBtn from '../IconBtn';

const cx = classNames.bind(styles);

function ContactsModal({
  children,
  className,
  headerTitle,
  searchValue,
  setSearchValue,
  onSearch,
  searchBar,
  filters,
  options,
}) {
  // USE_NAVIGATE
  const navigate = useNavigate();

  //USE_REF
  const filterRef = useRef();
  const optionsRef = useRef();

  // USE_CONTEXT

  // USE_STATE
  const [isShowDropDownMenu, setIsShowDropDownMenu] = useState(false);
  const [filter, setFilter] = useState();
  const [isOpenOptions, setIsOpenOptions] = useState(false);

  //
  useOutsideAlerter(filterRef, () => {
    setIsShowDropDownMenu(false);
  });

  useOutsideAlerter(optionsRef, () => {
    setIsOpenOptions(false);
  });

  return (
    <div className={cx('wrapper', { [className]: className })}>
      <div className={cx('header')}>
        <div className={cx('header-title')}>
          <h3 className={cx('header-title-text')}>{headerTitle}</h3>
          <div ref={optionsRef} className={cx('operations')}>
            <button className={cx('options-btn')} onClick={() => setIsOpenOptions((prev) => !prev)}>
              <ThreeDotIcon className={cx('operation-icon')} width={'2.2rem'} height={'2.2rem'} />
            </button>
            {isOpenOptions && (
              <TippyWrapper className={cx('menu-options')}>
                {options.map((option, index) => {
                  return (
                    <IconBtn
                      key={index}
                      className={cx('messenger-option')}
                      icon={option.icon}
                      title={option.title}
                      medium
                      onClick={option.onClick}
                    />
                  );
                })}
              </TippyWrapper>
            )}
          </div>
        </div>
        <div className={cx('header-menu')}>
          {filters && (
            <div className={cx('drop-down-container')} ref={filterRef}>
              <button
                className={cx('drop-down-btn')}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsShowDropDownMenu((prev) => !prev);
                }}
              >
                <p>{filter || filters[0].title}</p>
                {isShowDropDownMenu ? (
                  <DownArrowIcon className={cx('arrow-icon')} height="2.4rem" width="2.4rem" />
                ) : (
                  <RightArrowIcon className={cx('arrow-icon')} height="2.4rem" width="2.4rem" />
                )}
              </button>

              {isShowDropDownMenu && (
                <TippyWrapper className={cx('drop-down-menu')}>
                  {filters.map((filter) => {
                    return (
                      <IconBtn
                        key={filter.title}
                        className={cx('filter-option')}
                        icon={filter.icon}
                        title={filter.title}
                        medium
                        onClick={() => {
                          setFilter(filter.title);
                          setIsShowDropDownMenu(false);
                          filter.onClick();
                        }}
                      />
                    );
                  })}
                </TippyWrapper>
              )}
            </div>
          )}
          {searchBar && (
            <div className={cx('search-container')}>
              <input
                value={searchValue}
                type="text"
                className={cx('search-input')}
                placeholder="Search users"
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <span onClick={onSearch}>
                <SearchIcon width={'4.5rem'} height={'3.5rem'} className={cx('more-icon')} />
              </span>
            </div>
          )}
        </div>
      </div>
      <div className={cx('container')}>{children}</div>
    </div>
  );
}

export default ContactsModal;
