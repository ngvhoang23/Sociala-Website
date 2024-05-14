import Cookies from 'universal-cookie';
import styles from './ChatFooter.module.scss';
import classNames from 'classnames/bind';
import { useContext, useEffect, useRef, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import EmojiPicker, { EmojiStyle } from 'emoji-picker-react';
import { ArrowRightIcon, CloseIcon, DocumentIcon, FileIcon, PlusIcon, SmileIcon } from '../Icons';
import { isImage, isVideo } from '~/UserDefinedFunctions';
import useOutsideAlerter from '~/hooks/useOutsideAlerter';
import { CurrentRoomContext } from '~/Context/CurrentRoomContext';
import { RoomStateContext } from '~/Context/RoomStateContext';
import { SocketContext } from '~/Context/SocketContext';
import { RoomIdsContext } from '~/Context/RoomIdsContext';
import TippyWrapper from '../TippyWrapper';
import IconBtn from '../IconBtn';
import MediaItem from '../MediaItem/MediaItem';
import FileItem from '../FileItem';
import { IsOpenRoomInfoContext } from '~/pages/Messenger/Contexts/IsOpenRoomInfo';

const cx = classNames.bind(styles);
const cookies = new Cookies();

function ChatFooter({ handleSendMessage }) {
  const userInfoContext = useContext(UserInfoContext);
  const user = userInfoContext.user;

  // USE_REF
  const fileUploadInput = useRef();
  const inputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const optionMenuRef = useRef(null);

  // USE_CONTEXT
  const isOpenRoomInfoContext = useContext(IsOpenRoomInfoContext);
  const isOpenRoomInfo = isOpenRoomInfoContext.isOpen;
  const setIsOpenRoomInfo = isOpenRoomInfoContext.setIsOpen;

  const currentRoomContext = useContext(CurrentRoomContext);
  const currentRoom = currentRoomContext.currentRoom;
  const setCurrentRoom = currentRoomContext.handleSetCurrentRoom;

  const roomStateContext = useContext(RoomStateContext);
  const roomState = roomStateContext.roomState;
  const setRoomState = roomStateContext.setRoomState;

  const roomIdsContext = useContext(RoomIdsContext);
  const roomIds = roomIdsContext.roomIds;
  const setRoomIds = roomIdsContext.setRoomIds;

  const socket = useContext(SocketContext);

  // USE_STATE
  const [newMessage, setNewMessage] = useState('');
  const [isShowEmojiPicker, setIsShowEmojiPicker] = useState(false);
  const [uploadFile, setUploadFile] = useState();
  const [uploadFiles, setUploadFiles] = useState([]);
  const [isShowMenu, setIsShowMenu] = useState(false);
  const [isInRoom, setIsInRoom] = useState(true);

  const handleKey = (e) => {
    if (e.code === 'Enter' && e.getModifierState('Composition')) {
      e.preventDefault(); // Ngăn chặn sự kiện Enter thừa
    }
    if (e.code === 'Enter') {
      setNewMessage('');
      setUploadFiles([]);
      handleSendMessage({ uploadFiles, messageText: newMessage });
    }
  };

  const handleDeleteFile = (index) => {
    uploadFiles.splice(index, 1);
    setUploadFiles([...uploadFiles]);
  };

  useOutsideAlerter(emojiPickerRef, () => {
    setIsShowEmojiPicker(false);
  });

  useOutsideAlerter(optionMenuRef, () => {
    setIsShowMenu(false);
  });

  useEffect(() => {
    if (currentRoom?.room_id) {
      const check = currentRoom?.members.findIndex((member) => member.user_id === user.user_id) !== -1;
      setIsInRoom(check);
    }
  }, [currentRoom?.room_id]);

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
      if (roomState.room_id == currentRoom?.room_id) {
        setIsInRoom(false);
      }
    } else if (roomState && roomState.state_type == 'leave_room' && roomState.member_id == user.user_id) {
      if (roomState.room_id == currentRoom?.room_id) {
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

  return (
    <div className={cx('wrapper')} onClick={() => inputRef.current.focus()}>
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
                  file_name={`${uploadFile.name}`}
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

      <div className={cx('container')}>
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
        <div ref={optionMenuRef} className={cx('option-container')}>
          <button
            className={cx('show-options-btn')}
            onClick={(e) => {
              e.stopPropagation();
              setIsShowMenu((prev) => !prev);
            }}
          >
            <PlusIcon width={'2rem'} height={'2rem'} />
          </button>
          {isShowMenu && (
            <TippyWrapper className={cx('menu-options')} onClick={() => setIsShowMenu(false)}>
              <IconBtn
                className={cx('option-item')}
                icon={<DocumentIcon width="2.4rem" height="2.4rem" />}
                title="Add a file"
                medium
                onClick={() => fileUploadInput.current.click()}
              />
            </TippyWrapper>
          )}
        </div>
        {isInRoom ? (
          <div className={cx('edit-area')}>
            <textarea
              className={cx('edit-input', { extend: !isOpenRoomInfo })}
              ref={inputRef}
              rows={
                isOpenRoomInfo
                  ? Math.ceil(newMessage.length / 54) > 5
                    ? 5
                    : Math.ceil(newMessage.length / 54) || 1
                  : Math.ceil(newMessage.length / 106) > 5
                    ? 5
                    : Math.ceil(newMessage.length / 106) || 1
              }
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
              }}
              onKeyDown={handleKey}
              spellCheck={false}
              placeholder="Chat now..."
            />
          </div>
        ) : (
          <div className={cx('blocked-chat')}>You was removed from this room</div>
        )}
        <div className={cx('emoji-container')}>
          <button
            className={cx('emoji-btn')}
            onClick={(e) => {
              e.stopPropagation();
              isInRoom && setIsShowEmojiPicker((prev) => !prev);
            }}
          >
            <SmileIcon height="2.4rem" width="2.4rem" />
          </button>
          {isShowEmojiPicker && (
            <span ref={emojiPickerRef} className={cx('emoji-picker-box')} onClick={(e) => e.stopPropagation()}>
              <EmojiPicker
                emojiStyle={EmojiStyle.NATIVE}
                onEmojiClick={(data) => {
                  isInRoom && setNewMessage((prev) => prev + data.emoji);
                }}
              />
            </span>
          )}
        </div>

        <button
          className={cx('send-btn')}
          onClick={() => {
            setNewMessage('');
            setUploadFiles([]);
            handleSendMessage({ uploadFiles, messageText: newMessage });
          }}
        >
          <ArrowRightIcon width={'2.4rem'} height={'2.4rem'} />
        </button>
      </div>
    </div>
  );
}

export default ChatFooter;
