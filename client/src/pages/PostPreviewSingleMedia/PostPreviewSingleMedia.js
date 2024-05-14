import classNames from 'classnames/bind';
import styles from './PostPreviewSingleMedia.module.scss';
import { useContext, useEffect, useRef, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import Cookies from 'universal-cookie';
import moment from 'moment';
import {
  CloseIcon,
  CommentIcon,
  EditIcon,
  LeftArrowIcon,
  RightArrowIcon,
  SaveIcon,
  ShareIcon,
  ThreeDotIcon,
  XMarkIcon,
} from '~/components/Icons';
import TippyWrapper from '~/components/TippyWrapper';
import IconBtn from '~/components/IconBtn';
import ReactionListTippy from '~/components/ReactionListTippy';
import ReactionPicker from '~/components/ReactionPicker/ReactionPicker';
import CommentContainer from '~/components/CommentContainer';
import PostCreation from '~/components/PostCreation';
import TippyHeadless from '@tippyjs/react/headless';
import { AngryIcon, LaughIcon, LikeIcon, SadIcon, WowIcon, HeartIcon } from '~/components/EmotionIcon/EmotionIcon';
import { AxiosInstanceContext } from '~/components/AxiosInterceptorWrapper/AxiosInterceptorWrapper';
import useOutsideAlerter from '~/hooks/useOutsideAlerter';
import { useNavigate } from 'react-router-dom';
import { CurrentReactionsModalContext } from '~/Context/CurrentReactionsModalContext';

const cx = classNames.bind(styles);
const cookies = new Cookies();

function PostPreviewSinglePhoto({ post_id, media_id, onClose }) {
  const userInfoContext = useContext(UserInfoContext);
  const user = userInfoContext.user;

  const axiosInstanceContext = useContext(AxiosInstanceContext);
  const axiosInstance = axiosInstanceContext;

  const currentReactionsModalContext = useContext(CurrentReactionsModalContext);
  const currentReactionsModal = currentReactionsModalContext.currentReactionsModal;
  const setCurrentReactionsModal = currentReactionsModalContext.setCurrentReactionsModal;

  // USE_REF
  const optionsRef = useRef();

  // USE_NAVIGATE
  const navigate = useNavigate();

  // USE_STATE
  const [pickedReaction, setPickedReaction] = useState(-1);
  const [isShowComments, setIsShowComment] = useState();
  const [commentQuantity, setCommentQuantity] = useState();
  const [reactionQuantity, setReactionQuantity] = useState();
  const [reactionInfo, setReactionInfo] = useState([]);
  const [shortTextContent, setShortTextContent] = useState('');
  const [textContent, setTextContent] = useState('');
  const [userReactions, setUserReactions] = useState({});
  const [userReactionsByType, setUserReactionsByType] = useState({});
  const [userCommentings, setUserCommentings] = useState({});
  const [postMedia, setPostMedia] = useState([]);
  const [isOpenPostCreation, setIsOpenPostCreation] = useState(false);
  const [refPostInfo, setRefPostInfo] = useState({});
  const [postInfo, setPostInfo] = useState();
  const [recentReaction, setRecentReaction] = useState([-1, -1]);
  const [isOpenOptions, setIsOpenOptions] = useState(false);
  const [currentMedia, setCurrentMedia] = useState();

  // USE_EFFECT
  useEffect(() => {
    const params = {
      queried_user_id: user.user_id,
      post_id,
    };

    const configurations = {
      params: params,
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };

    axiosInstance
      .get(`/posts/${post_id}`, configurations)
      .then((result) => {
        const postInfo = result.data;
        setPostInfo(postInfo);
        setShortTextContent(postInfo?.text_content.slice(0, 60));
        setTextContent(postInfo?.text_content);
        setPickedReaction(postInfo?.react_type);
        setCommentQuantity(postInfo?.comment_quantity || 0);
        setReactionInfo(postInfo?.reaction_info);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [post_id]);

  useEffect(() => {
    setPostMedia(postInfo?.files?.filter((file) => file.type == 'image' || file.type == 'video') || []);
  }, [postInfo?.files]);

  useEffect(() => {
    const findedIndex = postMedia.findIndex((media) => media.file_id == media_id);
    if (findedIndex != -1) {
      const previewedMedia = { ...postMedia[findedIndex], index: findedIndex };
      setCurrentMedia(previewedMedia);
    } else {
      setCurrentMedia({});
    }
  }, [postMedia, media_id]);

  useEffect(() => {
    setRefPostInfo({
      ref_post_id: postInfo?.ref_post_id || postInfo?.post_id,
      ref_author_id: postInfo?.ref_author_id || postInfo?.author_id,
      ref_created_at: postInfo?.ref_created_at || postInfo?.created_at,
      ref_full_name: postInfo?.ref_full_name || postInfo?.author_full_name,
      ref_text_content: postInfo?.ref_text_content || postInfo?.text_content,
      ref_user_avatar: postInfo?.ref_user_avatar || postInfo?.author_avatar,
    });
  }, [postInfo]);

  useEffect(() => {
    if (postInfo?.text_content.split(/\r\n|\r|\n/).length > 4) {
      setShortTextContent(postInfo?.text_content.split('\n').slice(0, 4).join('\n'));
    }
  }, []);

  useEffect(() => {
    if (recentReaction[0] == -1) {
      return;
    }
    if (recentReaction[0]) {
      if (!recentReaction[1]) {
        reactionInfo.forEach((reaction, index) => {
          if (reaction.type == recentReaction[0]) {
            reaction.quantity = reaction.quantity - 1;
          }
        });

        reactionInfo.sort((react1, react2) => react2.quantity - react1.quantity);

        setReactionInfo(JSON.parse(JSON.stringify(reactionInfo.filter((reaction) => reaction.quantity != 0))));
      } else {
        let findedIndex = -1;
        reactionInfo.forEach((reaction, index) => {
          if (reaction.type == recentReaction[1]) {
            findedIndex = index;
            reaction.quantity = reaction.quantity + 1;
          }
          if (reaction.type == recentReaction[0]) {
            reaction.quantity = reaction.quantity - 1;
            return;
          }
        });
        if (findedIndex == -1) {
          reactionInfo.push({ type: recentReaction[1], quantity: 1 });
        }
        setReactionInfo(JSON.parse(JSON.stringify(reactionInfo.filter((reaction) => reaction.quantity != 0))));
      }
    } else {
      if (recentReaction[1]) {
        let check = false;
        reactionInfo.forEach((reaction) => {
          if (reaction.type == recentReaction[1]) {
            check = true;
            reaction.quantity++;
          }
        });
        if (check) {
          reactionInfo.sort((react1, react2) => react2.quantity - react1.quantity);
          setReactionInfo(JSON.parse(JSON.stringify(reactionInfo)));
        } else {
          reactionInfo.push({ type: recentReaction[1], quantity: 1 });
          setReactionInfo(JSON.parse(JSON.stringify(reactionInfo)));
        }
      }
    }
  }, [recentReaction]);

  useEffect(() => {
    if (pickedReaction == -1) {
      return;
    }
    setRecentReaction([recentReaction[1], pickedReaction]);
  }, [pickedReaction]);

  useEffect(() => {
    let reactionQuantity = 0;
    reactionInfo.forEach((reaction) => (reactionQuantity += reaction.quantity));
    setReactionQuantity(reactionQuantity);
  }, [reactionInfo]);

  useEffect(() => {
    // DISABLE SCROLL BAR
    const rootElement = document.getElementById('root');
    rootElement.style.overflow = 'hidden';
  }, []);

  // FUNCTION_HANDLER
  const handleDeletePost = () => {
    const payload = {
      queried_user_id: user.user_id,
      post_id,
    };

    const configurations = {
      data: payload,
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };
    axiosInstance
      .delete(`/posts/${post_id}`, configurations)
      .then((result) => {
        window.location.reload(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleOpenPostEditor = () => {
    window.location.href = `/posts/post-editor/${post_id}`;
  };

  const handleExpandContent = () => {
    setShortTextContent(postInfo?.text_content);
  };

  const handleShrinkContent = () => {
    if (postInfo?.text_content.split(/\r\n|\r|\n/).length > 4) {
      setShortTextContent(postInfo?.text_content.split('\n').slice(0, 4).join('\n'));
    } else {
      setShortTextContent(postInfo?.text_content.slice(0, 270));
    }
  };

  const handleGetUserReactionByType = (reaction_type) => {
    const params = {
      post_id,
      reaction_type,
    };

    const configurations = {
      params: params,
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };

    axiosInstance
      .get(`/posts/reaction-types/${post_id}`, configurations)
      .then((result) => {
        setUserReactionsByType({ data: result.data.top10_reaction_of_user, quantity: result.data.number_of_reactions });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const renderReactionIcon = () => {
    const Comps = [];
    let z_index = 10;
    reactionInfo.forEach((reaction, index) => {
      if (index > 2) return;
      if (reaction.quantity == 0) {
        return;
      }
      switch (reaction.type) {
        case 'like':
          Comps.push(
            <span key={reaction.type}>
              <TippyHeadless
                interactive={true}
                offset={[-22, 10]}
                delay={[100, 0]}
                placement="top-start"
                render={(attrs) => (
                  <div className="box" tabIndex="-1" {...attrs}>
                    <ReactionListTippy
                      reaction_type="like"
                      user_reactions={userReactionsByType.data}
                      reaction_count={userReactionsByType.quantity}
                    />
                  </div>
                )}
              >
                <span>
                  <LikeIcon
                    className={cx('emoji-icon', 'like-icon')}
                    onMouseEnter={() => {
                      handleGetUserReactionByType('like');
                    }}
                  />
                </span>
              </TippyHeadless>
            </span>,
          );
          break;
        case 'love':
          Comps.push(
            <span key={reaction.type}>
              <TippyHeadless
                interactive={true}
                offset={[-22, 10]}
                delay={[100, 0]}
                placement="top-start"
                render={(attrs) => (
                  <div className="box" tabIndex="-1" {...attrs}>
                    <ReactionListTippy
                      reaction_type="love"
                      user_reactions={userReactionsByType.data}
                      reaction_count={userReactionsByType.quantity}
                    />
                  </div>
                )}
              >
                <span>
                  <HeartIcon
                    className={cx('emoji-icon', 'heart-icon')}
                    onMouseEnter={() => {
                      handleGetUserReactionByType('heart');
                    }}
                  />
                </span>
              </TippyHeadless>
            </span>,
          );
          break;
        case 'haha':
          Comps.push(
            <span key={reaction.type}>
              <TippyHeadless
                interactive={true}
                offset={[-22, 10]}
                delay={[100, 0]}
                placement="top-start"
                render={(attrs) => (
                  <div className="box" tabIndex="-1" {...attrs}>
                    <ReactionListTippy
                      reaction_type="haha"
                      user_reactions={userReactionsByType.data}
                      reaction_count={userReactionsByType.quantity}
                    />
                  </div>
                )}
              >
                <span>
                  <LaughIcon
                    className={cx('emoji-icon', 'laugh-icon')}
                    onMouseEnter={() => {
                      handleGetUserReactionByType('laugh');
                    }}
                  />
                </span>
              </TippyHeadless>
            </span>,
          );
          break;
        case 'sad':
          Comps.push(
            <span key={reaction.type}>
              <TippyHeadless
                interactive={true}
                offset={[-22, 10]}
                delay={[100, 0]}
                placement="top-start"
                render={(attrs) => (
                  <div className={'box'} tabIndex="-1" {...attrs}>
                    <ReactionListTippy
                      key={reaction.type}
                      reaction_type="sad"
                      user_reactions={userReactionsByType.data}
                      reaction_count={userReactionsByType.quantity}
                    />
                  </div>
                )}
              >
                <span>
                  <SadIcon
                    className={cx('emoji-icon', 'sad-icon')}
                    onMouseEnter={() => {
                      handleGetUserReactionByType('sad');
                    }}
                  />
                </span>
              </TippyHeadless>
            </span>,
          );
          break;
        case 'wow':
          Comps.push(
            <span key={reaction.type}>
              <TippyHeadless
                interactive={true}
                offset={[-22, 10]}
                delay={[100, 0]}
                placement="top-start"
                render={(attrs) => (
                  <div className="box" tabIndex="-1" {...attrs}>
                    <ReactionListTippy
                      reaction_type="wow"
                      user_reactions={userReactionsByType.data}
                      reaction_count={userReactionsByType.quantity}
                    />
                  </div>
                )}
              >
                <span>
                  <WowIcon
                    className={cx('emoji-icon', 'wow-icon')}
                    onMouseEnter={() => {
                      handleGetUserReactionByType('wow');
                    }}
                  />
                </span>
              </TippyHeadless>
            </span>,
          );
          break;
        case 'angry':
          Comps.push(
            <span key={reaction.type}>
              <TippyHeadless
                interactive={true}
                offset={[-22, 10]}
                delay={[100, 0]}
                placement="top-start"
                render={(attrs) => (
                  <div className="box" tabIndex="-1" {...attrs}>
                    <ReactionListTippy
                      reaction_type="angry"
                      user_reactions={userReactionsByType.data}
                      reaction_count={userReactionsByType.quantity}
                    />
                  </div>
                )}
              >
                <span>
                  <AngryIcon
                    className={cx('emoji-icon', 'angry-icon')}
                    onMouseEnter={() => {
                      handleGetUserReactionByType('angry');
                    }}
                  />
                </span>
              </TippyHeadless>
            </span>,
          );
          break;
        default:
          Comps.push(<></>);
      }
    });
    return Comps;
  };

  const _renderReactionIcon = () => {
    const Comps = [];
    let z_index = 10;
    reactionInfo.forEach((reaction, index) => {
      if (index > 2) return;
      if (reaction.quantity == 0) {
        return;
      }
      switch (reaction.type) {
        case 'like':
          Comps.push(
            <span key={reaction.type} style={{ zIndex: z_index }}>
              <LikeIcon
                width="22rem"
                height="22rem"
                className={cx('emoji-icon', 'like-icon')}
                onMouseEnter={() => {
                  handleGetUserReactionByType('like');
                }}
              />
            </span>,
          );
          break;
        case 'love':
          Comps.push(
            <span key={reaction.type} style={{ zIndex: z_index }}>
              <HeartIcon
                width="22rem"
                height="22rem"
                className={cx('emoji-icon', 'heart-icon')}
                onMouseEnter={() => {
                  handleGetUserReactionByType('heart');
                }}
              />
            </span>,
          );
          break;
        case 'haha':
          Comps.push(
            <span key={reaction.type} style={{ zIndex: z_index }}>
              <LaughIcon
                width="22rem"
                height="22rem"
                className={cx('emoji-icon', 'laugh-icon')}
                onMouseEnter={() => {
                  handleGetUserReactionByType('laugh');
                }}
              />
            </span>,
          );
          break;
        case 'sad':
          Comps.push(
            <span key={reaction.type} style={{ zIndex: z_index }}>
              <SadIcon
                width="22rem"
                height="22rem"
                className={cx('emoji-icon', 'sad-icon')}
                onMouseEnter={() => {
                  handleGetUserReactionByType('sad');
                }}
              />
            </span>,
          );
          break;
        case 'wow':
          Comps.push(
            <span key={reaction.type} style={{ zIndex: z_index }}>
              <WowIcon
                width="22rem"
                height="22rem"
                className={cx('emoji-icon', 'wow-icon')}
                onMouseEnter={() => {
                  handleGetUserReactionByType('wow');
                }}
              />
            </span>,
          );
          break;
        case 'angry':
          Comps.push(
            <span key={reaction.type} style={{ zIndex: z_index }}>
              <AngryIcon
                width="22rem"
                height="22rem"
                className={cx('emoji-icon', 'angry-icon')}
                onMouseEnter={() => {
                  handleGetUserReactionByType('angry');
                }}
              />
            </span>,
          );
          break;
        default:
          Comps.push(<></>);
      }
      z_index--;
    });
    return Comps;
  };

  const handleGetUserReaction = () => {
    const params = {
      post_id,
    };

    const configurations = {
      params: params,
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };

    axiosInstance
      .get(`/posts/reactions/${post_id}`, configurations)
      .then((result) => {
        setUserReactions({ data: result.data.top10_recently_reactions, quantity: result.data.number_of_comments });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleOpenReactionsModal = () => {
    const params = {
      post_id,
    };

    const configurations = {
      params: params,
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };

    axiosInstance
      .get(`/posts/reactions/${post_id}`, configurations)
      .then((result) => {
        setCurrentReactionsModal(result.data.reactions);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleGetUserCommentings = () => {
    const params = {
      post_id,
    };

    const configurations = {
      params: params,
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };

    axiosInstance
      .get(`/posts/user-commentings/${post_id}`, configurations)
      .then((result) => {
        setUserCommentings({
          data: result.data.top10_recently_user_commenting,
          quantity: result.data.number_of_reactions,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getPost = () => {
    const params = {
      post_id,
    };

    const configurations = {
      params: params,
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };

    axiosInstance
      .get(`/posts/${post_id}`, configurations)
      .then((result) => {
        setReactionInfo(result.data.reaction_info);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getReactBtn = (pickedReaction) => {
    switch (pickedReaction) {
      case 'like':
        return (
          <>
            <LikeIcon />
            <p className={cx('reaction-title')}>{pickedReaction.charAt(0).toUpperCase() + pickedReaction.slice(1)}</p>
          </>
        );

      case 'love':
        return (
          <>
            <HeartIcon />
            <p className={cx('reaction-title')}>{pickedReaction.charAt(0).toUpperCase() + pickedReaction.slice(1)}</p>
          </>
        );

      case 'haha':
        return (
          <>
            <LaughIcon />
            <p className={cx('reaction-title')}>{pickedReaction.charAt(0).toUpperCase() + pickedReaction.slice(1)}</p>
          </>
        );

      case 'sad':
        return (
          <>
            <SadIcon />
            <p className={cx('reaction-title')}>{pickedReaction.charAt(0).toUpperCase() + pickedReaction.slice(1)}</p>
          </>
        );

      case 'wow':
        return (
          <>
            <WowIcon />
            <p className={cx('reaction-title')}>{pickedReaction.charAt(0).toUpperCase() + pickedReaction.slice(1)}</p>
          </>
        );

      case 'angry':
        return (
          <>
            <AngryIcon />
            <p className={cx('reaction-title')}>{pickedReaction.charAt(0).toUpperCase() + pickedReaction.slice(1)}</p>
          </>
        );

      default:
        return (
          <>
            <LikeIcon />
            <p className={cx('reaction-title')}>Like</p>
          </>
        );
    }
  };

  const handleSharePost = () => {
    setIsOpenPostCreation(true);
  };

  const handleChangeReaction = () => {
    if (pickedReaction) {
      const payload = {
        post_id,
      };

      const configurations = {
        data: payload,
        headers: {
          Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
        },
      };

      axiosInstance
        .delete(`/posts/reactions/${post_id}`, configurations)
        .then((result) => {})
        .catch((err) => {
          console.log(err);
        });
      setPickedReaction(undefined);
    } else {
      setPickedReaction('like');
    }
  };

  const handleGoPrev = () => {
    if (currentMedia.index == 0) {
      return;
    }
    setCurrentMedia((prev) => {
      return { ...postMedia[prev.index - 1], index: prev.index - 1 };
    });
  };

  const handleGoFollowing = () => {
    console.log(currentMedia.index);
    if (currentMedia.index == postMedia.length) {
      return;
    }
    setCurrentMedia((prev) => {
      return { ...postMedia[prev.index + 1], index: prev.index + 1 };
    });
  };

  useOutsideAlerter(optionsRef, () => {
    setIsOpenOptions(false);
  });

  const handleRedirectToProfile = () => {
    onClose();
    navigate(`/profiles/${postInfo?.author_id}/posts`, { replace: true });
  };

  const renderMediaItem = ({ url, type }) => {
    if (type == 'image') {
      return <img alt="" src={url} />;
    } else if (type == 'video') {
      return (
        <video controls muted>
          <source src={url} type="video/mp4" />
          Something wents wrong!
        </video>
      );
    }
  };

  return (
    <div className={cx('wrapper')}>
      <button
        className={cx('close-btn')}
        onClick={() => {
          onClose();
        }}
      >
        <CloseIcon className={cx('close-icon')} width="2.8rem" height="2.8rem" />
      </button>
      {postInfo && (
        <div className={cx('container')}>
          <div className={cx('photo-container')}>
            {currentMedia.index > 0 && (
              <button className={cx('go-prev-btn')} onClick={handleGoPrev}>
                <LeftArrowIcon height="3.2rem" width="3.2rem" />
              </button>
            )}
            {/* <img alt="" src={currentMedia?.url} />
            <MediaItem item={{ url: currentMedia?.url, type: currentMedia?.type }} /> */}
            {renderMediaItem({ url: currentMedia?.url, type: currentMedia?.type })}
            {currentMedia.index < postMedia.length - 1 && (
              <button className={cx('go-following-btn')} onClick={handleGoFollowing}>
                <RightArrowIcon height="3.2rem" width="3.2rem" />
              </button>
            )}
          </div>
          <div className={cx('post-container')}>
            <div className={cx('header')}>
              <div className={cx('author-info')}>
                <img className={cx('author-avatar')} src={postInfo?.author_avatar} alt="" />
                <div>
                  <p className={cx('author-name')} onClick={handleRedirectToProfile}>
                    {postInfo?.author_full_name}
                  </p>
                  <p className={cx('time-stamp')}>
                    {postInfo?.created_at ? moment(postInfo?.created_at).fromNow() : ''}
                  </p>
                </div>
              </div>
              <div className={cx('operations')} ref={optionsRef}>
                <button className={cx('options-btn')} onClick={() => setIsOpenOptions((prev) => !prev)}>
                  <ThreeDotIcon className={cx('operation-icon')} width={'2.2rem'} height={'2.2rem'} />
                </button>
                {isOpenOptions && (
                  <TippyWrapper className={cx('menu-options')} onClick={() => setIsOpenOptions(false)}>
                    {user.user_id == postInfo?.author_id && (
                      <IconBtn
                        className={cx('post-option')}
                        icon={<EditIcon width="2.1rem" height="2.1rem" />}
                        title="Edit Post"
                        medium
                        onClick={handleOpenPostEditor}
                      />
                    )}
                    {user.user_id == postInfo?.author_id && (
                      <IconBtn
                        className={cx('post-option', 'delete-post-option')}
                        icon={<XMarkIcon width="2.1rem" height="2.1rem" />}
                        title="Delete Post"
                        medium
                        onClick={handleDeletePost}
                      />
                    )}
                    <IconBtn
                      className={cx('post-option')}
                      icon={<SaveIcon width="2.1rem" height="2.1rem" />}
                      title="Save Post"
                      medium
                    />
                  </TippyWrapper>
                )}
              </div>
            </div>
            <div className={cx('body')}>
              <div className={cx('post-content')}>
                <p>
                  {shortTextContent}
                  {shortTextContent.length < textContent.length && <span>... </span>}
                  {shortTextContent.length < textContent.length && (
                    <button className={cx('adjust-content-length-btn')} onClick={handleExpandContent}>
                      See more
                    </button>
                  )}
                  {shortTextContent.length == textContent.length &&
                    (textContent.split(/\r\n|\r|\n/).length > 4 || textContent.length > 100) && (
                      <button className={cx('adjust-content-length-btn')} onClick={handleShrinkContent}>
                        See less
                      </button>
                    )}
                </p>
              </div>
            </div>

            <div className={cx('footer')}>
              <div className={cx('interactions-info')}>
                <div
                  className={cx('reactions-container')}
                  onClick={() => {
                    handleOpenReactionsModal();
                  }}
                >
                  <div className={cx('reactions-icon')}>{_renderReactionIcon()}</div>

                  {reactionQuantity != 0 && (
                    <>
                      <TippyHeadless
                        interactive={true}
                        offset={[-32, 10]}
                        delay={[100, 200]}
                        placement="top-start"
                        render={(attrs) => (
                          <div className="box" tabIndex="-1" {...attrs}>
                            <ReactionListTippy
                              _key="reactions"
                              user_reactions={userReactions.data}
                              reaction_count={userReactions.quantity}
                            />
                          </div>
                        )}
                      >
                        <p className={cx('reaction-quantity')} onMouseEnter={handleGetUserReaction}>
                          {reactionQuantity}
                        </p>
                      </TippyHeadless>
                    </>
                  )}
                </div>
                <div className={cx('comments-container')}>
                  <span>
                    <TippyHeadless
                      interactive={true}
                      offset={[0, 6]}
                      delay={[100, 100]}
                      placement="top-start"
                      render={(attrs) => (
                        <div className="box" tabIndex="-1" {...attrs}>
                          <ReactionListTippy
                            user_reactions={userCommentings.data}
                            reaction_count={userCommentings.quantity}
                          />
                        </div>
                      )}
                    >
                      <p
                        className={cx('comment-quantity')}
                        onClick={() => setIsShowComment((prev) => !prev)}
                        onMouseEnter={() => {
                          handleGetUserCommentings();
                        }}
                      >
                        {commentQuantity ? `${commentQuantity} Comments` : ''}
                      </p>
                    </TippyHeadless>
                  </span>
                </div>
              </div>
              <div className={cx('interactions')}>
                <div className={cx('tippy-requirement')}>
                  <TippyHeadless
                    interactive={true}
                    offset={[-10, 60]}
                    delay={[100, 300]}
                    placement="top-start"
                    render={(attrs) => (
                      <div className="box" tabIndex="-1" {...attrs}>
                        <ReactionPicker
                          className={cx('reaction-picker')}
                          post_id={post_id}
                          setReactionQuantity={setReactionQuantity}
                          pickedReaction={pickedReaction}
                          setPickedReaction={setPickedReaction}
                          setReactionInfo={setReactionInfo}
                          reactionInfo={reactionInfo}
                          getPost={getPost}
                        />
                      </div>
                    )}
                  >
                    <button
                      className={cx('interaction-btn', 'reaction-btn', {
                        [`${pickedReaction}-active`]: pickedReaction,
                      })}
                      onClick={handleChangeReaction}
                    >
                      {getReactBtn(pickedReaction)}
                    </button>
                  </TippyHeadless>
                </div>

                <button
                  className={cx('interaction-btn')}
                  onClick={() => {
                    setIsShowComment((prev) => !prev);
                  }}
                >
                  <CommentIcon width="2.2rem" height="2.2rem" />
                  <p>Comment</p>
                </button>

                <button className={cx('interaction-btn')} onClick={handleSharePost}>
                  <ShareIcon width="2.4rem" height="2.4rem" />
                  <p>Share</p>
                </button>
              </div>
            </div>
            {isShowComments && (
              <CommentContainer
                className={cx('comment-container')}
                post_id={post_id}
                setCommentQuantity={setCommentQuantity}
                author_id={postInfo?.author_id}
              />
            )}
            {isOpenPostCreation && (
              <div className={cx('post-creation-modal')} onClick={() => setIsOpenPostCreation(false)}>
                <div className={cx('post-creation-container')}>
                  <PostCreation
                    ref_post_id={refPostInfo?.ref_post_id}
                    ref_author_id={refPostInfo?.ref_author_id}
                    ref_created_at={refPostInfo?.ref_created_at}
                    ref_full_name={refPostInfo?.ref_full_name}
                    ref_text_content={refPostInfo?.ref_text_content}
                    ref_user_avatar={refPostInfo?.ref_user_avatar}
                    files={postInfo?.files}
                    className={cx('post-creation-container')}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PostPreviewSinglePhoto;
