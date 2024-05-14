import classNames from 'classnames/bind';
import styles from './MiniChatBoxTyper.module.scss';
import { CloseIcon, DocumentIcon, EditIcon, FileIcon, PlaneIcon, PlusIcon, SmileIcon, XMarkIcon } from '../Icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceSmile, faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import { useContext, useEffect, useRef, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import OptionMenu from '../OptionMenu';
import OptionItem from '../OptionItem';
import { isImage, isVideo } from '~/UserDefinedFunctions';
import { RoomStateContext } from '~/Context/RoomStateContext';
import { SocketContext } from '~/Context/SocketContext';
import { RoomIdsContext } from '~/Context/RoomIdsContext';
import moment from 'moment';
import Cookies from 'universal-cookie';
import axios from 'axios';
import TippyWrapper from '../TippyWrapper';
import IconBtn from '../IconBtn';
import { faUserXmark } from '@fortawesome/free-solid-svg-icons';
import { faFacebookMessenger } from '@fortawesome/free-brands-svg-icons';
import EmojiPicker from 'emoji-picker-react';
import EmojiPickerContainer from '../EmojiPickerContainer';
import MediaItem from '../MediaItem/MediaItem';
import FileItem from '../FileItem';
import useOutsideAlerter from '~/hooks/useOutsideAlerter';
import { ContactsContext } from '~/Context/ContactsContext';
import { AxiosInstanceContext } from '../AxiosInterceptorWrapper/AxiosInterceptorWrapper';

const cookies = new Cookies();
const cx = classNames.bind(styles);

function MiniChatBoxTyper({ room_type, room_id, members, handleSendMessage, handleEmitReadMessage }) {
  // CONSTANCE
  const userInfoContext = useContext(UserInfoContext);
  const user = userInfoContext.user;

  // USE_REF
  const fileUploadInput = useRef();
  const emojiRef = useRef();
  const menuRef = useRef();

  // USE_CONTEXT
  const roomStateContext = useContext(RoomStateContext);
  const roomState = roomStateContext.roomState;
  const setRoomState = roomStateContext.setRoomState;

  const roomIdsContext = useContext(RoomIdsContext);
  const roomIds = roomIdsContext.roomIds;
  const setRoomIds = roomIdsContext.setRoomIds;

  const socket = useContext(SocketContext);

  const axiosInstanceContext = useContext(AxiosInstanceContext);
  const axiosInstance = axiosInstanceContext;

  // USE_STATE
  const [textContent, setTextContent] = useState('');
  const [isShowMenu, setIsShowMenu] = useState('');
  const [uploadFiles, setUploadFiles] = useState([]);
  const [isInRoom, setIsInRoom] = useState(true);
  const [isOpenEmojiPicker, setIsOpenEmojiPicker] = useState(false);

  // USE_EFFECT

  useEffect(() => {
    const check = members.some((member) => member.user_id === user.user_id);
    setIsInRoom(check);
  }, []);

  useEffect(() => {
    if (
      roomState &&
      roomState.state_type == 'add_member' &&
      roomState.members.some((member) => member.user_id == user.user_id)
    ) {
      setIsInRoom(true);
    } else if (roomState && roomState.state_type == 'remove_member' && roomState.member_id == user.user_id) {
      socket?.emit('leave_room', roomState.room_id);
      setRoomIds((prev) => {
        return prev.filter((room) => room.room_id != roomState.room_id);
      });
      if (roomState.room_id == room_id) {
        setIsInRoom(false);
      }
    } else if (roomState && roomState.state_type == 'leave_room' && roomState.member_id == user.user_id) {
      if (roomState.room_id == room_id) {
        setIsInRoom(false);
      }
    }
  }, [socket, roomState]);

  // FUNCTION_HANDLER
  const handleUploadFiles = (values) => {
    setIsShowMenu(false);
    const fileArr = [...values];
    const fileFilter = fileArr.filter((file) => file.size / 1000000 <= 25);
    if (fileArr.length > fileFilter.length) {
      alert('require file size less than 25MB');
    }
    setUploadFiles((prev) => [...prev, ...fileFilter]);
  };

  const handleDeleteFile = (index) => {
    uploadFiles.splice(index, 1);
    setUploadFiles([...uploadFiles]);
  };

  const handleKey = (e) => {
    setIsOpenEmojiPicker(false);
    if (e.code === 'Enter') {
      e.preventDefault();
      setTextContent('');
      setUploadFiles([]);
      handleSendMessage({ uploadFiles, messageText: textContent });
    }
  };

  useOutsideAlerter(emojiRef, () => {
    console.log('object');
    setIsOpenEmojiPicker(false);
  });

  useOutsideAlerter(menuRef, () => {
    setIsShowMenu(false);
  });

  return (
    <div
      className={cx('wrapper')}
      onClick={() => {
        console.log('typer');
        handleEmitReadMessage(room_id);
      }}
    >
      {isInRoom ? (
        <div className={cx('edit-container')}>
          {uploadFiles.length > 0 && (
            <div className={cx('files-container')}>
              {uploadFiles?.map((uploadFile, ind) => {
                if (isImage(uploadFile.name)) {
                  return (
                    <MediaItem
                      key={ind}
                      className={cx('uploaded-item')}
                      type="image"
                      src={URL.createObjectURL(uploadFile)}
                      mini
                      removable
                      onRemove={() => handleDeleteFile(ind)}
                    />
                  );
                } else if (isVideo(uploadFile.name)) {
                  return (
                    <MediaItem
                      key={ind}
                      className={cx('uploaded-item')}
                      type="video"
                      src={URL.createObjectURL(uploadFile)}
                      mini
                      removable
                      onRemove={() => handleDeleteFile(ind)}
                    />
                  );
                } else {
                  return (
                    <FileItem
                      key={ind}
                      className={cx('doc-item', 'uploaded-item')}
                      file_name={`${uploadFile.name}_${uploadFile.type}`}
                      file_size={uploadFile.size}
                      removable
                      mini
                      onRemove={() => handleDeleteFile(ind)}
                    />
                  );
                }
              })}
            </div>
          )}
          <div className={cx('type-area')}>
            <div ref={menuRef} className={cx('option-container')}>
              <input
                name="upload-files"
                multiple
                ref={fileUploadInput}
                type="file"
                className={cx('file-input')}
                onChange={(e) => {
                  handleUploadFiles(e.target.files);
                }}
              />
              <button
                className={cx('show-options-btn')}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsShowMenu((prev) => !prev);
                  handleEmitReadMessage(room_id);
                }}
              >
                <PlusIcon width={'2rem'} height={'2rem'} />
              </button>
              {isShowMenu && (
                <TippyWrapper className={cx('menu-options')} onClick={() => setIsShowMenu(false)}>
                  <IconBtn
                    className={cx('option-item')}
                    icon={<DocumentIcon width="2rem" height="2rem" />}
                    title="Add a file"
                    small
                    onClick={() => fileUploadInput.current.click()}
                  />
                </TippyWrapper>
              )}
            </div>
            <div className={cx('text-container')}>
              <textarea
                value={textContent}
                spellCheck={false}
                rows={Math.ceil(textContent.length / 22) > 5 ? 5 : Math.ceil(textContent.length / 22) || 1}
                onChange={(e) => setTextContent(e.target.value)}
                onKeyDown={handleKey}
                // onFocus={() => handleEmitReadMessage(room_id)}
              />
            </div>
            <div className={cx('operations')}>
              <div className={cx('emoji-picker')} ref={emojiRef}>
                <button
                  className={cx('opening-emoji-btn')}
                  onClick={(e) => {
                    e.stopPropagation();
                    // handleEmitReadMessage(room_id);
                    setIsOpenEmojiPicker((prev) => !prev);
                  }}
                >
                  <SmileIcon width={'2.2rem'} height={'2.2rem'} />
                </button>
                {isOpenEmojiPicker && (
                  <EmojiPickerContainer
                    className={cx('emoji-picker-box')}
                    onEmojiClick={(data) => {
                      isInRoom && setTextContent((prev) => prev + data.emoji);
                    }}
                  />
                )}
              </div>
              <button
                className={cx('send-btn', { 'send-active': uploadFiles.length > 0 || textContent.trim() })}
                onClick={() => {
                  setTextContent('');
                  setUploadFiles([]);
                  handleSendMessage({ uploadFiles, messageText: textContent });
                }}
              >
                <PlaneIcon width={'2.6rem'} height={'2.6rem'} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className={cx('blocked-chat')}>You was removed from this room</div>
      )}
    </div>
  );
}

export default MiniChatBoxTyper;
