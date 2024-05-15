import classNames from 'classnames/bind';
import styles from './GlobalModals.module.scss';
import PostPreviewSingleMedia from '~/pages/PostPreviewSingleMedia';
import { useContext, useEffect } from 'react';
import { CurrentMediaPreviewContext } from '~/Context/CurrentMediaPreviewContext';
import PostCreation from '../PostCreation';
import { IsOpenPostGeneratorContext } from '~/Context/IsOpenPostGeneratorContext';
import { StoryPreviewContext } from '~/Context/StoryPreviewContext';
import StoryPreview from '~/pages/StoryPreview';
import { IsOpenStoryGeneratorContext } from '~/Context/IsOpenStoryGeneratorContext';
import StoryGenerator from '~/pages/StoryGenerator';
import { CheckingLayerContext } from '~/Context/CheckingLayerContext';
import ConfirmModal from '../ConfirmModal';
import ConfirmingOptionModal from '../ConfirmingOptionModal';
import MediaViewModal from '../MediaViewModal';
import { MediaPreviewContext } from '~/Context/MediaPreviewContext';
import { IsOpenGroupChatGeneratorContext } from '~/Context/IsOpenGroupChatGeneratorContext';
import GroupChatGenerator from '../GroupChatGenerator';
import ChangePasswordModal from '~/pages/SettingDashboard/Tabs/components/ChangePasswordModal/ChangePasswordModal';
import { IsOpenChangePasswordModalContext } from '~/Context/IsOpenChangePasswordModalContext';
import EditingGroupChatModal from '../EditingGroupChatModal';
import { RoomCustomizingContext } from '~/Context/RoomCustomizingContext';
import { IsLoadingContext } from '~/Context/IsLoadingContext';
import LoadingModal from '../LoadingModal';
import MutualFriendsModal from '../MutualFriendsModal';
import { CurrentMutualFriendsModalContext } from '~/Context/CurrentMutualFriendsModalContext';
import { CurrentReactionsModalContext } from '~/Context/CurrentReactionsModalContext';
import ReactionsModal from '../ReactionsModal/ReactionsModal';
import AddingGroupChatMembersModal from '../AddingGroupChatMembersModal';
import { RoomAddingMembersContext } from '~/Context/RoomAddingMembersContext';
import { IsOpenEditProfileModalContext } from '~/Context/IsOpenEditProfileModalContext';
import EditProfileModal from '../EditProfileModal';
import { IsOpenChangeEmailModalContext } from '~/Context/IsOpenChangeEmailModalContext';
import ChangeEmailModal from '~/pages/SettingDashboard/Tabs/components/ChangeEmailModal/ChangeEmailModal';

const cx = classNames.bind(styles);

function GlobalModals() {
  // USE_CONTEXT
  const currentMediaPreviewContext = useContext(CurrentMediaPreviewContext);
  const currentMediaPreview = currentMediaPreviewContext.currentMediaPreview;
  const setCurrentMediaPreview = currentMediaPreviewContext.setCurrentMediaPreview;

  const isOpenPostGeneratorContext = useContext(IsOpenPostGeneratorContext);
  const isOpenPostGenerator = isOpenPostGeneratorContext.isOpen;
  const setIsOpenPostGenerator = isOpenPostGeneratorContext.setIsOpen;

  const storyPreviewContext = useContext(StoryPreviewContext);
  const storyPreview = storyPreviewContext.storyPreview;
  const setStoryPreview = storyPreviewContext.setStoryPreview;

  const isOpenStoryGeneratorContext = useContext(IsOpenStoryGeneratorContext);
  const isOpenStoryGenerator = isOpenStoryGeneratorContext.isOpen;
  const setIsOpenStoryGenerator = isOpenStoryGeneratorContext.setIsOpen;

  const checkingLayerContext = useContext(CheckingLayerContext);
  const functionHandlers = checkingLayerContext.functionHandlers;
  const setFunctionHandlers = checkingLayerContext.setFunctionHandlers;

  const mediaPreviewContext = useContext(MediaPreviewContext);
  const mediaPreview = mediaPreviewContext.mediaPreview;
  const setMediaPreview = mediaPreviewContext.setMediaPreview;

  const isOpenChangePasswordModalContext = useContext(IsOpenChangePasswordModalContext);
  const isOpenChangePasswordModal = isOpenChangePasswordModalContext.isOpen;
  const setIsOpenChangePasswordModal = isOpenChangePasswordModalContext.setIsOpen;

  const isOpenChangeEmailModalContext = useContext(IsOpenChangeEmailModalContext);
  const isOpenChangeEmailModal = isOpenChangeEmailModalContext.isOpen;
  const setIsOpenChangeEmailModal = isOpenChangeEmailModalContext.setIsOpen;

  const isOpenGroupChatGeneratorContext = useContext(IsOpenGroupChatGeneratorContext);
  const isOpenGroupChatGenerator = isOpenGroupChatGeneratorContext.isOpenGroupChatGenerator;
  const setIsOpenGroupChatGenerator = isOpenGroupChatGeneratorContext.setIsOpenGroupChatGenerator;

  const roomCustomizingContext = useContext(RoomCustomizingContext);
  const setCustomizingRoomInfo = roomCustomizingContext.setRoomInfo;
  const customizingRoomInfo = roomCustomizingContext.roomInfo;

  const isLoadingContext = useContext(IsLoadingContext);
  const isLoading = isLoadingContext.isLoading;
  const setIsLoading = isLoadingContext.setIsLoading;

  const isOpenEditProfileModalContext = useContext(IsOpenEditProfileModalContext);
  const isOpenEditProfileModal = isOpenEditProfileModalContext.isOpen;
  const setIsOpenEditProfileModal = isOpenEditProfileModalContext.setIsOpen;

  const currentMutualFriendsModalContext = useContext(CurrentMutualFriendsModalContext);
  const currentMutualFriendsModal = currentMutualFriendsModalContext.currentMutualFriendsModal;
  const setCurrentMutualFriendsModal = currentMutualFriendsModalContext.setCurrentMutualFriendsModal;

  const currentReactionsModalContext = useContext(CurrentReactionsModalContext);
  const currentReactionsModal = currentReactionsModalContext.currentReactionsModal;
  const setCurrentReactionsModal = currentReactionsModalContext.setCurrentReactionsModal;

  const roomAddingMembersContext = useContext(RoomAddingMembersContext);
  const setInfoAdding = roomAddingMembersContext.setInfoAdding;
  const infoAdding = roomAddingMembersContext.infoAdding;

  return (
    <>
      {currentMediaPreview && (
        <div className={cx('modal')}>
          <PostPreviewSingleMedia
            post_id={currentMediaPreview?.post_id}
            media_id={currentMediaPreview?.media_id}
            onClose={() => {
              // ENABLE SCROLL BAR
              const rootElement = document.getElementById('root');
              rootElement.style.overflow = 'unset';
              setCurrentMediaPreview();
            }}
          />
        </div>
      )}

      {isOpenPostGenerator && (
        <div className={cx('modal')} onClick={() => setIsOpenPostGenerator(false)}>
          <div className={cx('post-generator')}>
            <PostCreation onClick={(e) => e.stopPropagation()} />
          </div>
        </div>
      )}

      {storyPreview && (
        <StoryPreview
          index={storyPreview?.index}
          author_id={storyPreview?.author_id}
          story_list={storyPreview?.story_list}
          storyData={storyPreview?.storyData}
          onClick={(e) => e.stopPropagation()}
        />
      )}

      {isOpenStoryGenerator && <StoryGenerator />}

      {functionHandlers && !functionHandlers?.multiple_choice && (
        <ConfirmModal
          alert_title={functionHandlers.alert_title}
          alert_content={functionHandlers.alert_content}
          onConfirm={() => {
            functionHandlers.confirmFunction();
            setFunctionHandlers();
          }}
          onDeny={() => setFunctionHandlers(false)}
        />
      )}

      {functionHandlers && functionHandlers?.multiple_choice && (
        <ConfirmingOptionModal
          header_title={functionHandlers.alert_title}
          onConfirm={(value) => {
            functionHandlers.confirmFunction(value);
            setFunctionHandlers();
          }}
          options={functionHandlers.options}
          onDeny={() => setFunctionHandlers(false)}
        ></ConfirmingOptionModal>
      )}

      {mediaPreview && (
        <MediaViewModal
          className={cx('media-view-modal')}
          media={mediaPreview.media}
          mediaView={mediaPreview.currentMediaView}
          setMediaView={mediaPreview.setCurrentMediaView}
        />
      )}

      {isOpenGroupChatGenerator && (
        <GroupChatGenerator
          onClose={() => {
            setIsOpenGroupChatGenerator(false);
          }}
        />
      )}

      {isOpenChangePasswordModal && <ChangePasswordModal onClose={() => setIsOpenChangePasswordModal(false)} />}
      {isOpenChangeEmailModal && <ChangeEmailModal onClose={() => setIsOpenChangeEmailModal(false)} />}

      {customizingRoomInfo?.isOpenRoomCustomizing && (
        <EditingGroupChatModal
          room_id={customizingRoomInfo.room_id}
          onClose={() =>
            setCustomizingRoomInfo({
              ...customizingRoomInfo,
              isOpenRoomCustomizing: false,
            })
          }
        />
      )}

      {isLoading && <LoadingModal />}
      {currentMutualFriendsModal && (
        <MutualFriendsModal friends={currentMutualFriendsModal} onClose={() => setCurrentMutualFriendsModal(false)} />
      )}

      {currentReactionsModal && (
        <ReactionsModal onClose={() => setCurrentReactionsModal(false)} _reactions={currentReactionsModal} />
      )}

      {infoAdding && (
        <AddingGroupChatMembersModal
          room_members={infoAdding.members}
          room_id={infoAdding.room_id}
          onClose={() => setInfoAdding()}
        />
      )}

      {isOpenEditProfileModal && <EditProfileModal onClose={() => setIsOpenEditProfileModal(false)} />}
    </>
  );
}

export default GlobalModals;
