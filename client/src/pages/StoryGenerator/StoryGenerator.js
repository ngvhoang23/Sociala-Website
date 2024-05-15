import classNames from 'classnames/bind';
import styles from './StoryGenerator.module.scss';
import { useContext, useEffect, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import { IsOpenStoryGeneratorContext } from '~/Context/IsOpenStoryGeneratorContext';
import StoryCreationModal from '~/components/StoryCreationModal';
import Cookies from 'universal-cookie';
import {
  CloseIcon,
  DownArrowIcon,
  GearIcon,
  LeftArrowIcon,
  RightArrowIcon,
  UpArrowIcon,
  XMarkIcon,
} from '~/components/Icons';
import SongItem from '~/components/SongItem';
import { isImage, isVideo } from '~/UserDefinedFunctions';
import SongPicker from '~/components/SongPicker';
import moment from 'moment';
import axios from 'axios';
import { CheckingLayerContext } from '~/Context/CheckingLayerContext';
import { AxiosInstanceContext } from '~/components/AxiosInterceptorWrapper/AxiosInterceptorWrapper';
import LoadingModal from '~/components/LoadingModal';
import { IsLoadingContext } from '~/Context/IsLoadingContext';
import { NeedToReLoadContext } from '~/Context/NeedToReLoadContext';
import MediaItem2 from '~/components/MediaItem2/MediaItem2';
import ReactDOM from 'react';

const cookies = new Cookies();
const cx = classNames.bind(styles);

function StoryGenerator() {
  const userInfoContext = useContext(UserInfoContext);
  const user = userInfoContext.user;

  // USE_CONTEXT
  const isOpenStoryGeneratorContext = useContext(IsOpenStoryGeneratorContext);
  const isOpenStoryGenerator = isOpenStoryGeneratorContext.isOpen;
  const setIsOpenStoryGenerator = isOpenStoryGeneratorContext.setIsOpen;

  const checkingLayerContext = useContext(CheckingLayerContext);
  const functionHandlers = checkingLayerContext.functionHandlers;
  const setFunctionHandlers = checkingLayerContext.setFunctionHandlers;

  const axiosInstanceContext = useContext(AxiosInstanceContext);
  const axiosInstance = axiosInstanceContext;

  const isLoadingContext = useContext(IsLoadingContext);
  const isLoading = isLoadingContext.isLoading;
  const setIsLoading = isLoadingContext.setIsLoading;

  const needToReLoadSignalContext = useContext(NeedToReLoadContext);
  const reLoadingSignal = needToReLoadSignalContext.reLoadingSignal;
  const setReLoadingSignal = needToReLoadSignalContext.setReLoadingSignal;

  // USE_STATE
  const [uploadedMedia, setUploadedMedia] = useState();
  const [thumbnail, setThumbnail] = useState();
  const [isOpenSongPicker, setIsOpenSongPicker] = useState(false);
  const [songs, setSongs] = useState([]);
  const [pickedSong, setPickedSong] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // USE_EFFECT
  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };

    axiosInstance
      .get(`/stories/story-songs`, config)
      .then((result) => {
        setSongs(result.data);
      })
      .catch((error) => {
        error = new Error();
      });
  }, []);

  // FUNCTION_HANDLER
  const handleSubmit = () => {
    setFunctionHandlers({
      alert_title: 'Post story?',
      alert_content: 'Are you sure you want to post this story? Your story will be posted.',
      confirmFunction: handlePostStory,
    });
    // ENABLE SCROLL BAR
    const rootElement = document.getElementById('root');
    rootElement.style.overflow = 'unset';
  };

  const handlePostStory = () => {
    const formData = new FormData();

    if (!uploadedMedia) {
      return;
    }

    setIsLoading(true);

    formData.append('storyMedia', uploadedMedia);
    formData.append('storyMedia', thumbnail);
    formData.append('created_at', moment().valueOf());
    pickedSong && formData.append('duration', pickedSong.song_duration);
    pickedSong && formData.append('attached_song_id', pickedSong.song_id);

    // CONFIG MULTIPART FORM
    const config = {
      headers: { 'content-type': 'multipart/form-data', Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}` },
    };

    if (uploadedMedia && thumbnail) {
      console.log('submit');
      axiosInstance
        .post(`/stories/`, formData, config)
        .then((result) => {
          setIsLoading(false);
          setIsOpenStoryGenerator(false);
          handleReloadingPage();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleDiscard = () => {
    setFunctionHandlers({
      alert_title: 'Discard story?',
      alert_content: "Are you sure you want to discard this story? Your story won't be saved.",
      confirmFunction: () => {
        setPickedSong();
        setUploadedMedia();
      },
    });
  };

  const handleReloadingPage = () => {
    setReLoadingSignal((prev) => ({ status: !prev.status }));
    setIsLoading(true);
  };

  useEffect(() => {
    // DISABLE SCROLL BAR
    const rootElement = document.getElementById('root');
    rootElement.style.overflow = 'hidden';
  }, []);

  return (
    <div className={cx('wrapper')}>
      <button
        className={cx('close-btn')}
        onClick={() => {
          // ENABLE SCROLL BAR
          const rootElement = document.getElementById('root');
          rootElement.style.overflow = 'unset';
          setIsOpenStoryGenerator(false);
        }}
      >
        <CloseIcon height="2.8rem" width="2.8rem" />
      </button>
      <div className={cx('story-info-container')}>
        <div className={cx('header')}>
          <h3 className={cx('header-title')}>Your Story</h3>
          <div className={cx('user-container')}>
            <div className={cx('user-info')}>
              <MediaItem2
                item={{ url: user.user_avatar, type: 'image' }}
                width={56}
                height={56}
                border_radius={1000}
                _styles={
                  {
                    // boxShadow: 'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px',
                  }
                }
                className={cx('user-avatar')}
              />
              <h4 className={cx('user-name')}>{user.full_name}</h4>
            </div>
            <div className={cx('options')}></div>
          </div>

          <div className={cx('options-container')}>
            {uploadedMedia && (
              <>
                {pickedSong && (
                  <SongItem
                    song_name={pickedSong?.song_name}
                    singer_name={pickedSong?.singer_name}
                    song_img={pickedSong?.song_img_url}
                    song_url={pickedSong?.url}
                    className={cx('picked-song')}
                    preview
                    small
                  />
                )}
              </>
            )}

            {isImage(uploadedMedia?.name) && (
              <>
                <button
                  className={cx('add-song-btn')}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpenSongPicker((prev) => !prev);
                  }}
                >
                  <p className={cx('add-song-btn-title')}>Add Music</p>
                  {isOpenSongPicker ? (
                    <DownArrowIcon className={cx('navigate-icon')} height="2.6rem" width="2.6rem" />
                  ) : (
                    <>
                      <RightArrowIcon className={cx('navigate-icon')} height="2.6rem" width="2.6rem" />
                    </>
                  )}
                </button>
                {isOpenSongPicker && (
                  <SongPicker
                    className={cx('song-picker-container')}
                    songs={songs}
                    setPickedSong={setPickedSong}
                    setIsOpenSongPicker={setIsOpenSongPicker}
                    onClose={() => setIsOpenSongPicker(false)}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  ></SongPicker>
                )}
              </>
            )}
          </div>
        </div>

        <div className={cx('footer')}>
          <button className={cx('discard-btn')} onClick={handleDiscard}>
            Discard
          </button>
          <button
            className={cx('submit-btn', { active: uploadedMedia })}
            disabled={!uploadedMedia}
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
      <div className={cx('body')}>
        <StoryCreationModal
          uploadedMedia={uploadedMedia}
          setUploadedMedia={setUploadedMedia}
          thumbnail={thumbnail}
          setThumbnail={setThumbnail}
          className={cx('story-preview')}
          onClick={(e) => e.stopPropagation()}
          setIsUploading={setIsUploading}
        />
      </div>
      {isUploading && <LoadingModal />}
    </div>
  );
}

export default StoryGenerator;
