import classNames from 'classnames/bind';
import styles from './StoryPreviewModal.module.scss';
import Cookies from 'universal-cookie';
import { useContext, useEffect, useRef, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import moment from 'moment';
import {
  EarthIcon,
  EditIcon,
  EllipsisIcon,
  LeftArrowIcon,
  MuteIcon,
  PauseIcon,
  PlayIcon,
  RightArrowIcon,
  UnMuteIcon,
  XMarkIcon,
} from '../Icons';
import ProgressBar from '../ProgressBar';
import StoryListContainer from '../StoryListContainer';
import axios from 'axios';
import TippyWrapper from '../TippyWrapper';
import IconBtn from '../IconBtn';
import { AxiosInstanceContext } from '../AxiosInterceptorWrapper/AxiosInterceptorWrapper';
import { StoryPreviewContext } from '~/Context/StoryPreviewContext';
import { NeedToReLoadContext } from '~/Context/NeedToReLoadContext';
import { IsLoadingContext } from '~/Context/IsLoadingContext';
import MediaItem2 from '../MediaItem2/MediaItem2';

const cx = classNames.bind(styles);
const cookies = new Cookies();

function StoryPreviewModal({ index, storyData, story_list, onClick }) {
  const userInfoContext = useContext(UserInfoContext);
  const user = userInfoContext.user;

  const axiosInstanceContext = useContext(AxiosInstanceContext);
  const axiosInstance = axiosInstanceContext;

  const storyPreviewContext = useContext(StoryPreviewContext);
  const storyPreview = storyPreviewContext.storyPreview;
  const setStoryPreview = storyPreviewContext.setStoryPreview;

  const needToReLoadSignalContext = useContext(NeedToReLoadContext);
  const reLoadingSignal = needToReLoadSignalContext.reLoadingSignal;
  const setReLoadingSignal = needToReLoadSignalContext.setReLoadingSignal;

  const isLoadingContext = useContext(IsLoadingContext);
  const isLoading = isLoadingContext.isLoading;
  const setIsLoading = isLoadingContext.setIsLoading;

  // USE_REF
  const refInterval = useRef();
  const refVideo = useRef();
  const seenStories = useRef();
  const audioRef = useRef();

  // USE_STATE
  const [progress, setProgress] = useState(0);
  const [currentStory, setCurrentStory] = useState();
  const [currentStoryInd, setCurrentStoryInd] = useState(index);
  const [currentStoryCollection, setCurrentStoryCollection] = useState(story_list || []);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStoryAuthorId, setCurrentStoryAuthorId] = useState();
  const [currentSeenStories, setCurrentSeenStory] = useState([]);
  const [seenStoryData, setSeenStoryData] = useState();
  const [seenStoryInsertedToDB, setSeenStoryInsertedToDB] = useState(new Set());
  const [isMute, setIsMute] = useState(false);
  const [isOpenStoryOptions, setIsOpenStoryOptions] = useState(false);

  // USE_EFFECT

  // GET SEEN STORY DATA
  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };

    axiosInstance
      .get(`/stories/seen-stories`, config)
      .then((result) => {
        setSeenStoryData(result.data);
        seenStories.current = result.data;
        setSeenStoryInsertedToDB((prev) => {
          result.data.forEach((seen_story) => {
            prev.add(seen_story.story_id);
          });
          return prev;
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // MAP SEEN STORY INFO INTO CURRENT_STORY_LIST
  useEffect(() => {
    if (seenStoryData) {
      currentStoryCollection?.forEach((newStory) => {
        if (seenStoryData.some((seenStory) => seenStory.story_id == newStory.story_id)) {
          newStory.is_seen = true;
        } else {
          newStory.is_seen = false;
        }
      });
      setCurrentStoryCollection(JSON.parse(JSON.stringify(currentStoryCollection)));
    }
  }, [seenStoryData]);

  useEffect(() => {
    // SET AUTHOR ID EVERY TURN OF CURRENT STORY CHANGED
    setIsOpenStoryOptions(false);
    setCurrentStoryAuthorId(currentStory?.author_id);

    // FIND THE INDEX OF CURRENT STORY ID PLACED IN currentSeenStories
    // THEN REMOVED FROM THE INDEX FINDED BEFORE TO THE END OF currentSeenStories
    // IF THE INDEX IS NOT EXISTED, PUT THE CURRENT STORY ID TO THE TAIL.
    if (currentStory) {
      setCurrentSeenStory((prev) => {
        const current_story_ind = prev.findIndex((seen_story_id) => seen_story_id == currentStory?.story_id);
        if (current_story_ind == -1) {
          return [...prev, currentStory?.story_id];
        } else {
          return prev.filter((seen_story_id, index) => index <= current_story_ind);
        }
      });
      setIsPaused(false);
    }
  }, [currentStory]);

  useEffect(() => {
    // CHECK IF PROGRESS GET ENDED.
    if (progress >= currentStory?.duration) {
      // TURN INTO FOLLOWING STORY LIST IF IT IS THE END OF CURRENT STORY LIST
      if (currentStory.index >= currentStoryCollection.length - 1) {
        if (currentStoryInd < storyData.length) {
          setCurrentStoryInd((prev) => prev + 1);
        }
        return;
      }
      // RESET PROGRESS
      setProgress(0);

      // SET CURRENT STORY LIKE BEFORE
      if (currentStoryCollection[currentStory.index + 1]?.story_type == 'video') {
        getVideoDuration(currentStoryCollection[currentStory.index + 1].content)
          .then((duration) => {
            setCurrentStory((prev) => {
              return {
                duration: duration,
                story_id: currentStoryCollection[prev.index + 1].story_id,
                author_id: currentStoryCollection[prev.index + 1].author_id,
                content: currentStoryCollection[prev.index + 1].content,
                created_at: currentStoryCollection[prev.index + 1].created_at,
                thumbnail: currentStoryCollection[prev.index + 1].thumbnail,
                remaining_time: currentStoryCollection[prev.index + 1].remaining_time,
                story_type: currentStoryCollection[prev.index + 1].story_type,
                index: prev.index + 1,
              };
            });
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        setCurrentStory((prev) => {
          return {
            duration: currentStoryCollection[prev.index + 1].duration || 2,
            story_id: currentStoryCollection[prev.index + 1].story_id,
            author_id: currentStoryCollection[prev.index + 1].author_id,
            content: currentStoryCollection[prev.index + 1].content,
            created_at: currentStoryCollection[prev.index + 1].created_at,
            thumbnail: currentStoryCollection[prev.index + 1].thumbnail,
            remaining_time: currentStoryCollection[prev.index + 1].remaining_time,
            story_type: currentStoryCollection[prev.index + 1].story_type,
            song_img: currentStoryCollection[prev.index + 1]?.song_img,
            song_url: currentStoryCollection[prev.index + 1]?.song_url,
            singer_name: currentStoryCollection[prev.index + 1]?.singer_name,
            song_name: currentStoryCollection[prev.index + 1]?.song_name,
            index: prev.index + 1,
          };
        });
      }
    }
  }, [progress, refVideo?.current]);

  useEffect(() => {
    if (!currentStory) {
      return;
    }
    // IF USER WANT TO PAUSE THE CURRENT STORY, CLEAR INTERVAL
    if (isPaused) {
      audioRef?.current?.pause();
      refVideo?.current?.pause();
      clearInterval(refInterval.current);
    } else {
      refVideo?.current?.play();
      audioRef?.current?.play();
      // setInterval TO setProgress every 10ms
      refInterval.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= currentStory?.duration) {
            return 0;
          } else {
            return prev + 0.01;
          }
        });
      }, 10);
    }
    // CLEAR INTERVAL WHEN COMPONENT UNMOUNT
    return () => clearInterval(refInterval.current);
  }, [currentStory, isPaused]);

  useEffect(() => {
    if (!currentStory?.story_id || !seenStoryData) {
      return;
    }
    setIsMute(false);

    if (
      seenStories?.current &&
      !seenStories.current.some((seen_story) => seen_story.story_id == currentStory.story_id)
    ) {
      seenStories.current = [
        ...seenStories.current,
        { user_id: user.user_id, story_id: currentStory.story_id, created_at: moment().valueOf() },
      ];
    }

    if (!seenStoryInsertedToDB.has(currentStory?.story_id)) {
      setSeenStoryInsertedToDB((prev) => {
        prev.add(currentStory?.story_id);
        return prev;
      });

      const payload = {
        story_id: currentStory?.story_id,
        created_at: moment().valueOf(),
      };

      const configurations = {
        headers: {
          Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
        },
      };

      axiosInstance
        .post(`/stories/seen-stories`, payload, configurations)
        .then((result) => {})
        .catch((error) => {
          console.log(error);
        });
    }
  }, [currentStory]);

  // CHANGE currentStoryList WHEN THE storyId GET CHANGED
  useEffect(() => {
    const newStoryList = storyData[currentStoryInd];
    const currentSeenStories = [];
    let beginningInd = -1;
    if (seenStories?.current) {
      newStoryList?.forEach((newStory, index) => {
        if (seenStories.current.some((seenStory) => seenStory.story_id == newStory.story_id)) {
          newStory.is_seen = true;
          currentSeenStories.push(newStory.story_id);
        } else {
          newStory.is_seen = false;
          // FIND THE FIRST STORY HAS NOT SEEN YET
          if (beginningInd == -1) {
            beginningInd = index;
          }
        }
      });
    } else {
      return;
    }

    setCurrentStoryCollection(newStoryList);
    // PUT SEEN STORY INTO currentSeenStories variable
    setCurrentSeenStory(currentSeenStories);

    if (currentStoryInd >= storyData.length || currentStoryInd < 0) {
      setCurrentStoryAuthorId(undefined);
      setCurrentStory();
      // IF THERE IS NO STORY TO RENDER, CLEAR INTERVAL
      clearInterval(refInterval.current);
    } else {
      // SET CURRENT STORY

      // SET PROGRESS TO 0 (RESET PROGRESS BAR TO STARTING POINT)
      setProgress(0);

      if (beginningInd == -1 || !beginningInd) {
        beginningInd = 0;
      }

      // SET CURRENT STORY FRON THE INDEX FOUNDED BEFORE
      // IF IT IS VIDEO, RUN getVideoDuration TO GET THE THUMNAIL THEN SET CURRENT STORY
      if (newStoryList[beginningInd]?.story_type == 'video') {
        getVideoDuration(newStoryList[beginningInd]?.content)
          .then((duration) => {
            setCurrentStory((prev) => {
              return {
                duration: duration,
                story_id: newStoryList[beginningInd]?.story_id,
                author_id: newStoryList[beginningInd]?.author_id,
                content: newStoryList[beginningInd]?.content,
                created_at: newStoryList[beginningInd]?.created_at,
                thumbnail: newStoryList[beginningInd]?.thumbnail,
                remaining_time: newStoryList[beginningInd]?.remaining_time,
                story_type: newStoryList[beginningInd]?.story_type,
                index: beginningInd,
              };
            });
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        setCurrentStory({
          duration: newStoryList[beginningInd]?.duration || 2,
          story_id: newStoryList[beginningInd]?.story_id,
          author_id: newStoryList[beginningInd]?.author_id,
          content: newStoryList[beginningInd]?.content,
          created_at: newStoryList[beginningInd]?.created_at,
          thumbnail: newStoryList[beginningInd]?.thumbnail,
          remaining_time: newStoryList[beginningInd]?.remaining_time,
          story_type: newStoryList[beginningInd]?.story_type,
          song_img: newStoryList[beginningInd]?.song_img,
          song_url: newStoryList[beginningInd]?.song_url,
          singer_name: newStoryList[beginningInd]?.singer_name,
          song_name: newStoryList[beginningInd]?.song_name,
          index: beginningInd,
        });
      }
    }
  }, [currentStoryInd, seenStoryData]);

  // FUNCTION_HANDLER
  // VIDEO DURATION GETTING FUNCTION
  const getVideoDuration = (url) => {
    return new Promise((resolve, reject) => {
      const videoElement = document.createElement('video');
      videoElement.addEventListener('loadedmetadata', () => {
        const videoDuration = videoElement.duration;
        resolve(videoDuration);
      });

      videoElement.addEventListener('error', () => {
        reject(new Error('Failed to load the video.'));
      });

      videoElement.src = url;
    });
  };

  // PREV MOVING GETTING FUNCTION
  const handleMoveToPrev = () => {
    if (!currentStoryCollection) {
      if (currentStoryInd == storyData.length) {
        setCurrentStoryInd((prev) => prev - 1);
      }
      return;
    }
    if (currentStory.index <= 0) {
      if (currentStoryInd > -1) {
        setCurrentStoryInd((prev) => prev - 1);
      }
    } else {
      setProgress(0);
      if (currentStoryCollection[currentStory.index - 1]?.story_type == 'video') {
        getVideoDuration(currentStoryCollection[currentStory.index - 1].content)
          .then((duration) => {
            setCurrentStory((prev) => {
              return {
                duration: duration,
                content: currentStoryCollection[prev.index - 1].content,
                story_id: currentStoryCollection[prev.index - 1].story_id,
                author_id: currentStoryCollection[prev.index - 1].author_id,
                created_at: currentStoryCollection[prev.index - 1].created_at,
                thumbnail: currentStoryCollection[prev.index - 1].thumbnail,
                remaining_time: currentStoryCollection[prev.index - 1].remaining_time,
                story_type: currentStoryCollection[prev.index - 1].story_type,
                index: prev.index - 1,
              };
            });
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        setCurrentStory((prev) => {
          return {
            duration: currentStoryCollection[prev.index - 1].duration || 2,
            story_id: currentStoryCollection[prev.index - 1].story_id,
            author_id: currentStoryCollection[prev.index - 1].author_id,
            content: currentStoryCollection[prev.index - 1].content,
            created_at: currentStoryCollection[prev.index - 1].created_at,
            thumbnail: currentStoryCollection[prev.index - 1].thumbnail,
            remaining_time: currentStoryCollection[prev.index - 1].remaining_time,
            story_type: currentStoryCollection[prev.index - 1].story_type,
            song_img: currentStoryCollection[prev.index - 1]?.song_img,
            song_url: currentStoryCollection[prev.index - 1]?.song_url,
            singer_name: currentStoryCollection[prev.index - 1]?.singer_name,
            song_name: currentStoryCollection[prev.index - 1]?.song_name,
            index: prev.index - 1,
          };
        });
      }
    }
  };

  // FOLLOWING STORY GETTING FUNCTION
  const handleMoveToFollowing = () => {
    if (!currentStoryCollection) {
      if (currentStoryInd == -1) {
        setCurrentStoryInd((prev) => prev + 1);
      }
      return;
    }
    if (currentStory.index >= currentStoryCollection.length - 1) {
      if (currentStoryInd < storyData.length) {
        setCurrentStoryInd((prev) => prev + 1);
      }
      return;
    } else {
      setProgress(0);
      if (currentStoryCollection[currentStory.index + 1]?.story_type == 'video') {
        getVideoDuration(currentStoryCollection[currentStory.index + 1].content)
          .then((duration) => {
            setCurrentStory((prev) => {
              return {
                duration: duration,
                author_id: currentStoryCollection[prev.index + 1].author_id,
                story_id: currentStoryCollection[prev.index + 1].story_id,
                content: currentStoryCollection[prev.index + 1].content,
                created_at: currentStoryCollection[prev.index + 1].created_at,
                thumbnail: currentStoryCollection[prev.index + 1].thumbnail,
                remaining_time: currentStoryCollection[prev.index + 1].remaining_time,
                story_type: currentStoryCollection[prev.index + 1].story_type,
                index: prev.index + 1,
              };
            });
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        setCurrentStory((prev) => {
          return {
            duration: currentStoryCollection[prev.index + 1].duration || 2,
            story_id: currentStoryCollection[prev.index + 1].story_id,
            author_id: currentStoryCollection[prev.index + 1].author_id,
            content: currentStoryCollection[prev.index + 1].content,
            created_at: currentStoryCollection[prev.index + 1].created_at,
            thumbnail: currentStoryCollection[prev.index + 1].thumbnail,
            remaining_time: currentStoryCollection[prev.index + 1].remaining_time,
            story_type: currentStoryCollection[prev.index + 1].story_type,
            song_img: currentStoryCollection[prev.index + 1]?.song_img,
            song_url: currentStoryCollection[prev.index + 1]?.song_url,
            singer_name: currentStoryCollection[prev.index + 1]?.singer_name,
            song_name: currentStoryCollection[prev.index + 1]?.song_name,
            index: prev.index + 1,
          };
        });
      }
    }
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const handleToggleMute = () => {
    setIsMute((prev) => !prev);
  };

  const handleDeleteStory = () => {
    setIsLoading(true);
    const { story_id, author_id } = currentStory;

    const payload = {
      story_id,
      author_id,
    };

    const config = {
      data: payload,
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };

    axiosInstance
      .delete(`/stories/${story_id}`, config)
      .then((result) => {
        setStoryPreview();
        setIsLoading(false);
        handleReloadingPage();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleReloadingPage = () => {
    setReLoadingSignal((prev) => ({ status: !prev.status }));
    setIsLoading(true);
  };

  return (
    <div className={cx('wrapper')}>
      <div className={cx('stories-container')}>
        <StoryListContainer
          seen_story_data={seenStories?.current}
          current_author_id={currentStoryAuthorId}
          setCurrentStoryInd={setCurrentStoryInd}
          stories={storyData}
          setCurrentStoryCollection={setCurrentStoryCollection}
        />
      </div>
      <div className={cx('body')}>
        <button className={cx('prev-btn')} onClick={handleMoveToPrev}>
          <LeftArrowIcon />
        </button>

        {currentStoryCollection && (
          <div
            className={cx('container', 'bg-image')}
            onClick={(e) => {
              onClick(e);
            }}
          >
            {currentStory?.story_type == 'image' && (
              <>
                <MediaItem2
                  item={{ url: currentStory?.thumbnail, type: 'image' }}
                  width={380}
                  height={670}
                  border_radius={10}
                  _styles={{
                    boxShadow: 'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px',
                  }}
                  className={cx('background-image')}
                />
                {currentStory?.song_url && (
                  <audio
                    ref={audioRef}
                    key={currentStory?.story_id}
                    className={cx('audio-content')}
                    controls
                    autoPlay
                    muted={isMute}
                  >
                    <source src={currentStory?.song_url} type="audio/ogg" />
                    <source src={currentStory?.song_url} type="audio/mpeg" />
                    Your browser does not support the audio tag.
                  </audio>
                )}
              </>
            )}
            <div className={cx('media-content')} alt="">
              {currentStory?.story_type == 'video' && (
                <MediaItem2
                  _ref_video={refVideo}
                  muted={isMute}
                  autoPlay
                  controls={false}
                  item={{ url: currentStory?.content, type: 'video' }}
                  width={380}
                  height={670}
                  border_radius={10}
                  _styles={{
                    boxShadow: 'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px',
                  }}
                  className={cx('video-content')}
                />
              )}
            </div>

            <div className={cx('progress-bars')}>
              {currentStoryCollection?.map((story, index) => {
                const findedInd = currentSeenStories.findIndex((seenStory) => seenStory == story.story_id);
                const check = findedInd != -1 && findedInd != currentSeenStories.length - 1;
                if (story.story_type == 'image') {
                  return (
                    <ProgressBar
                      key={index}
                      is_done={check}
                      className={cx('time-progress')}
                      progress={
                        currentStory?.index == index ? Math.floor((progress / currentStory?.duration) * 100) : 0
                      }
                    />
                  );
                } else {
                  return (
                    <ProgressBar
                      key={index}
                      is_done={check}
                      className={cx('time-progress')}
                      progress={
                        currentStory?.index == index
                          ? Math.floor((refVideo.current?.currentTime / refVideo.current?.duration) * 100)
                          : 0
                      }
                    />
                  );
                }
              })}
            </div>
            <div className={cx('author-info')}>
              <MediaItem2
                item={{ url: currentStoryCollection[0]?.author_avatar, type: 'image' }}
                width={40}
                height={40}
                border_radius={1000}
                _styles={{
                  boxShadow: 'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px',
                }}
                className={cx('author-avatar')}
              />
              <p className={cx('author-name')}>{currentStoryCollection[0]?.author_full_name}</p>
              <p className={cx('timestamp')}>
                <EarthIcon className={cx('earth-icon')} width={'1.4rem'} height={'1.4rem'} />
                {moment(currentStory?.created_at).fromNow()}
              </p>
            </div>

            <div className={cx('story-operations')}>
              {isPaused ? (
                <button className={cx('resume-btn')} onClick={handleResume}>
                  <PlayIcon height="2.2rem" width="2.2rem" />
                </button>
              ) : (
                <button className={cx('pause-btn')} onClick={handlePause}>
                  <PauseIcon height="2.2rem" width="2.2rem" />
                </button>
              )}
              <button className={cx('mute-toggle-btn')} onClick={handleToggleMute}>
                {isMute ? <UnMuteIcon height="2.2rem" width="2.2rem" /> : <MuteIcon height="2.2rem" width="2.2rem" />}
              </button>
              {currentStory?.author_id == user.user_id && (
                <div className={cx('story-options')}>
                  <button
                    className={cx('story-options-btn')}
                    onClick={() => {
                      if (isPaused) {
                        handleResume();
                      } else {
                        handlePause();
                      }
                      setIsOpenStoryOptions((prev) => !prev);
                    }}
                  >
                    <EllipsisIcon height="2.2rem" width="2.2rem" />
                  </button>
                  {isOpenStoryOptions && (
                    <TippyWrapper className={cx('menu-options')}>
                      <IconBtn
                        className={cx('story-option', 'delete-story-option')}
                        icon={<XMarkIcon width="2.1rem" height="2.1rem" />}
                        title="Delete Story"
                        medium
                        onClick={handleDeleteStory}
                      />
                    </TippyWrapper>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        {!currentStoryCollection && (
          <div
            className={cx('empty-story', 'container', 'bg-image')}
            style={{
              backgroundImage: `url('https://upload.wikimedia.org/wikipedia/commons/b/bc/Unknown_person.jpg')`,
            }}
            onClick={(e) => {
              onClick(e);
            }}
          ></div>
        )}
        <button className={cx('next-btn')} onClick={handleMoveToFollowing}>
          <RightArrowIcon />
        </button>
      </div>
    </div>
  );
}

export default StoryPreviewModal;
