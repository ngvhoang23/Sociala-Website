import axios from 'axios';
import classNames from 'classnames/bind';
import { useContext, useEffect, useRef, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import Cookies from 'universal-cookie';
import styles from './MessageTag.module.scss';
import {
  CloseIcon,
  EllipsisIcon,
  FileIcon,
  GearIcon,
  InfoIcon,
  ReplyIcon,
  ThreeDotIcon,
  TickIcon,
  TrashBinIcon,
  XMarkIcon,
} from '../Icons';
import OptionMenu from '../OptionMenu';
import OptionItem from '../OptionItem';
import TippyHeadless from '@tippyjs/react/headless';
import LoadingSpinner from '../LoadingSpinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import moment from 'moment';
import { formatFileSize } from '~/UserDefinedFunctions';
import MediaViewModal from '../MediaViewModal';
import AlertModal from '../AlertModal';
import RadioInput from '../RadioInput';
import useOutsideAlerter from '~/hooks/useOutsideAlerter';
import { memo } from 'react';
import { SocketContext } from '~/Context/SocketContext';
import { MediaContext } from '~/Context/MediaContext';
import FileItem from '../FileItem';
import MediaItem from '../MediaItem/MediaItem';
import TippyWrapper from '../TippyWrapper';
import IconBtn from '../IconBtn';
import { CheckingLayerContext } from '~/Context/CheckingLayerContext';
import MediaItem2 from '../MediaItem2/MediaItem2';
import MediaItem3 from '../MediaItem3/MediaItem3';

const cookies = new Cookies();

const cx = classNames.bind(styles);

function MessageTag({
  message_index,
  author_id,
  author_avatar,
  created_at,
  isRemoved,
  isSent,
  type,
  message,
  file_size,
  file_name,
  message_id,
  room_id,
  seenInfo,
  handleRemoveMessage,
  is_last_message,
  no_img,
  className,
  small,
  large,
  onPreview,
}) {
  const userInfoContext = useContext(UserInfoContext);
  const user = userInfoContext.user;

  // USE_REF
  const dropDownMenuRef = useRef(null);

  // USE_CONTEXT
  const socket = useContext(SocketContext);

  const mediaContext = useContext(MediaContext);
  const media = mediaContext.media;
  const setMedia = mediaContext.setMedia;

  const checkingLayerContext = useContext(CheckingLayerContext);
  const functionHandlers = checkingLayerContext.functionHandlers;
  const setFunctionHandlers = checkingLayerContext.setFunctionHandlers;

  // // USE_STATE
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [isOpenMenuBtn, setIsOpenMenuBtn] = useState(false);
  const [mediaView, setMediaView] = useState();
  const [isShowAlert, setIsShowAlert] = useState(false);
  const [removeType, setRemoveType] = useState(1);

  // // USE OUTSIDE
  useOutsideAlerter(dropDownMenuRef, () => {
    setIsOpenMenu(false);
  });

  const downloadFile = (url, filename) => {
    axios.get(url, { responseType: 'blob' }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    });
  };

  const renderMessage = () => {
    if (isRemoved) {
      return <p className={cx('removed-message')}>message is removed</p>;
    }
    switch (type) {
      case 'text':
        return <p className={cx('text-content')}>{message}</p>;
      case 'image':
        return (
          <MediaItem3
            item={{ url: message, type: 'image' }}
            max_height={small ? 160 : 260}
            max_width={small ? 160 : 260}
            border_radius={10}
            _styles={{
              boxShadow: 'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px',
            }}
            className={cx('media-item')}
          />
        );
      case 'video':
        return (
          <MediaItem3
            item={{ url: message, type: 'video' }}
            max_height={small ? 160 : 260}
            max_width={small ? 160 : 260}
            border_radius={10}
            _styles={{
              boxShadow: 'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px',
            }}
            controls={true}
            className={cx('media-item')}
          />
        );
      case 'document':
        return (
          <FileItem
            className={cx('doc-item')}
            file_name={file_name}
            file_size={file_size}
            file_url={message}
            small={small}
          />
        );
      default:
        break;
    }
  };

  const handleShowMediaView = () => {
    if (type !== 'text' && type !== 'document') {
      setMediaView({ url: message, type: type });
    }
  };

  const handleSubmitRemoveMessage = () => {
    if (isRemoved) {
      return;
    }

    if (author_id !== user.user_id) {
      handleRemoveMessage(0, message_id, message_index);
    } else {
      setFunctionHandlers({
        alert_title: 'Who do you want to remove this message for?',
        multiple_choice: true,

        options: [
          {
            option_title: 'Unsend for everyone',
            option_description:
              'This message will be unsent for everyone in the chat. Others may have already seen or forwarded it. Unsent messages can still be included in reports.',
            onClick: () => {
              setRemoveType(1);
            },
            value: 1,
          },
          {
            option_title: 'Remove for you',
            option_description:
              'This message will be removed for you. Others in the chat will still be able to see it.',
            onClick: () => {
              setRemoveType(0);
            },
            value: 0,
          },
        ],
        confirmFunction: (remove_type) => {
          handleRemoveMessage(remove_type, message_id, message_index);
        },
      });
    }
  };

  return (
    <>
      <div
        className={cx(
          'wrapper',
          author_id === user.user_id ? 'you' : 'other',
          { small: small },
          { 'no-img': no_img },
          { 'last-message': !no_img },
          { [className]: className },
        )}
        onMouseEnter={() => setIsOpenMenuBtn(true)}
        onMouseLeave={() => {
          !isOpenMenu && setIsOpenMenuBtn(false);
        }}
      >
        {author_id !== null ? (
          <>
            <div className={cx('container')}>
              <div className={cx('message-container')}>
                {author_id != user.user_id && !no_img && (
                  <div className={cx('author-avatar')}>
                    <MediaItem2
                      item={{ url: author_avatar, type: 'image' }}
                      width={small ? 33 : 38}
                      height={small ? 33 : 38}
                      border_radius={1000}
                      _styles={
                        {
                          // boxShadow: 'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px',
                        }
                      }
                      className={cx('user-avatar')}
                    />
                  </div>
                )}
                <div className={cx('message-content')} onClick={onPreview}>
                  {renderMessage()}
                </div>
              </div>
              {author_id === user.user_id && (
                <div className={cx('message-option')}>
                  <>
                    {isSent && is_last_message && (
                      <div className={cx('sent-tick-container')}>
                        <TickIcon height="2.2rem" width="2.2rem" />
                      </div>
                    )}
                    {!isSent && <LoadingSpinner className={cx('loading-spiner')} />}
                  </>

                  {seenInfo?.length > 0 && (
                    <span className={cx('seen-tag')}>
                      {seenInfo?.map((member, ind) => {
                        if (member?.user_id !== user.user_id && member?.user_id !== author_id) {
                          return <img key={ind} className={cx('seen-user-img')} src={member.avatar} alt="user-img" />;
                        }
                      })}
                    </span>
                  )}
                </div>
              )}
              {!isRemoved && (
                <div ref={dropDownMenuRef} className={cx('drop-down-container')}>
                  {isOpenMenuBtn && (
                    <button className={cx('options-btn')} onClick={() => setIsOpenMenu((prev) => !prev)}>
                      <ThreeDotIcon width="2.3rem" height="2.3rem" />
                    </button>
                  )}

                  {isOpenMenu && (
                    <TippyWrapper
                      className={cx('menu-options')}
                      onClick={() => {
                        setIsOpenMenu(false);
                        setIsOpenMenuBtn(false);
                      }}
                    >
                      <IconBtn
                        className={cx('option-item', { 'option-item-large': large })}
                        icon={<CloseIcon height={large ? '2.2rem' : '1.8rem'} width={large ? '2.2rem' : '1.8rem'} />}
                        title={'Delete'}
                        large
                        onClick={() => {
                          handleSubmitRemoveMessage();
                        }}
                      />
                      <IconBtn
                        className={cx('option-item', { 'option-item-large': large })}
                        icon={<ReplyIcon height={large ? '2.2rem' : '1.8rem'} width={large ? '2.2rem' : '1.8rem'} />}
                        title={'Reply'}
                        large
                      />
                    </TippyWrapper>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className={cx('notify-text')}>{renderMessage()}</div>
        )}
      </div>
    </>
  );
}

export default memo(MessageTag);
