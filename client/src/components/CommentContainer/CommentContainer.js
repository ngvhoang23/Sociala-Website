import classNames from 'classnames/bind';
import styles from './CommentContainer.module.scss';
import CommentTag from '../CommentTag/CommentTag';
import { useContext, useEffect, useRef, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import { createId, isImage, isVideo } from '~/UserDefinedFunctions';
import MediaItem from '../MediaItem/MediaItem';
import moment from 'moment';
import Cookies from 'universal-cookie';
import { AttachIcon, RightShiftArrowIcon } from '../Icons';
import { AxiosInstanceContext } from '../AxiosInterceptorWrapper/AxiosInterceptorWrapper';
import { SocketContext } from '~/Context/SocketContext';

const cx = classNames.bind(styles);
const cookies = new Cookies();

function CommentContainer({ className, post_id, setCommentQuantity, author_id }) {
  const userInfoContext = useContext(UserInfoContext);
  const user = userInfoContext.user;

  const socket = useContext(SocketContext);

  const axiosInstanceContext = useContext(AxiosInstanceContext);
  const axiosInstance = axiosInstanceContext;

  // USE_REF
  const fileInputRef = useRef();
  const textInpRef = useRef();
  const last_comment = useRef();

  // USE_STATE
  const [commentText, setCommentText] = useState('');
  const [file, setFile] = useState();
  const [comments, setComments] = useState([]);
  const [isOpenEmojiPicker, setIsOpenEmojiPicker] = useState(false);
  const [isEditting, setIsEditting] = useState(false);
  const [edittingComment, setEdittingComment] = useState();
  const [commentEditedSignal, setCommentEditedSignal] = useState(false);

  // USE_EFFECT
  useEffect(() => {
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
      .get(`/posts/comments/${post_id}`, configurations)
      .then((result) => {
        setComments(result.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [commentEditedSignal]);

  // FUNCTION_HANDLER

  const handleRemoveMediaItem = () => {
    setFile();
  };

  const renderMediaItem = (file) => {
    if (isImage(file.name)) {
      return (
        <MediaItem type="image" src={URL.createObjectURL(file)} small removable onRemove={handleRemoveMediaItem} />
      );
    } else if (isVideo(file.name)) {
      return (
        <MediaItem type="video" src={URL.createObjectURL(file)} small removable onRemove={handleRemoveMediaItem} />
      );
    } else {
      return <span>invalid file</span>;
    }
  };

  const handleSubmit = () => {
    const formData = new FormData();

    formData.append('post_id', post_id);
    commentText && formData.append('text_content', commentText);
    file && formData.append('uploading-media', file);
    formData.append('created_at', moment().valueOf());

    const commentPackage = [];
    commentText &&
      commentPackage.push({
        comment_id: createId(user.user_id, post_id, 0),
        post_id,
        user_id: user.user_id,
        content: commentText,
        user_avatar: user.user_avatar,
        full_name: user.full_name,
        type: 'text',
        created_at: moment().valueOf(),
      });

    let file_type = null;

    if (file) {
      file_type = isImage(file.name) ? 'image' : isVideo(file.name) ? 'video' : null;
    }

    file &&
      file_type != null &&
      commentPackage.push({
        comment_id: createId(user.user_id, post_id, 1),
        post_id,
        user_id: user.user_id,
        content: URL.createObjectURL(file),
        user_avatar: user.user_avatar,
        full_name: user.full_name,
        type: isImage(file.name) ? 'image' : isVideo(file.name) ? 'video' : null,
        created_at: moment().valueOf(),
      });

    // commentPackage.length > 0 && setComments((prev) => [...prev, ...commentPackage]);

    if (commentText && file) {
      setCommentQuantity((prev) => prev + 2);
    } else if (commentText || file) {
      setCommentQuantity((prev) => prev + 1);
    }

    // CONFIG MULTIPART FORM
    const config = {
      headers: { 'content-type': 'multipart/form-data', Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}` },
    };

    (commentText || file) &&
      axiosInstance
        .post(`/posts/comments/${post_id}`, formData, config)
        .then((result) => {
          return postCommentNotifications();
        })
        .then((result) => {
          setCommentText('');
          setFile();
          setCommentEditedSignal((prev) => !prev);
          if (result !== -1) {
            socket?.emit('comment-post', {
              post_id: post_id,
              author_id: author_id,
              user_id_commented: user.user_id,
              created_at: moment().valueOf(),
            });
          }
        })
        .catch((error) => console.log(error));
  };

  const postCommentNotifications = () => {
    if (user?.user_id === author_id) {
      return Promise.resolve(-1);
    }

    return new Promise((resolve, reject) => {
      const payload = {
        user_id: user.user_id,
        target_user_ids: [author_id],
        defined_noti_id: 'noti_05',
        post_id: post_id,
        created_at: moment().valueOf(),
      };

      const configurations = {
        headers: {
          Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
        },
      };

      axiosInstance
        .post(`/notifications/multiple-noti`, payload, configurations)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  useEffect(() => {
    last_comment.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
  }, [comments]);

  const handleKey = (e) => {
    if (e.code === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={cx('wrapper', { [className]: className })}>
      <div className={cx('comment-container')}>
        <div className={cx('comment-list')}>
          {comments.map((comment) => {
            return (
              <CommentTag
                key={comment.comment_id}
                comment_id={comment.comment_id}
                is_edited={comment.is_edited}
                type={comment.type}
                className={cx('comment-item')}
                content={comment.content}
                author_avatar={comment.user_avatar}
                author_name={comment.full_name}
                comment_author_id={comment.user_id}
                created_at={comment.created_at}
                setComments={setComments}
                setEdittingComment={setEdittingComment}
                edittingComment={edittingComment}
                setCommentEditedSignal={setCommentEditedSignal}
                post_author_id={author_id}
              />
            );
          })}
          <div ref={last_comment} />
        </div>
        <div className={cx('comment-typer')}>
          <img className={cx('user-avatar')} alt="" src={user.user_avatar} />
          <div className={cx('typer-area')}>
            <div className={cx('content-area')}>
              <textarea
                ref={textInpRef}
                value={commentText}
                placeholder="Write a comment"
                spellCheck={false}
                className={cx('comment-inp')}
                onChange={(e) => {
                  setCommentText(e.target.value);
                }}
                onKeyDown={handleKey}
              />
              {file && <div className={cx('attacked-files-container')}>{renderMediaItem(file)}</div>}
            </div>
            <div className={cx('options')}>
              <button
                className={cx('option-btn')}
                onClick={() => {
                  fileInputRef.current.value = null;
                  fileInputRef.current.click();
                }}
              >
                <input
                  ref={fileInputRef}
                  className={cx('file-inp')}
                  type="file"
                  accept=".jpg, .mp4, .png"
                  onChange={(e) => {
                    setFile(e.target.files[0]);
                  }}
                />
                <AttachIcon height="2.2rem" width="2.2rem" />
              </button>

              {/* <TippyHeadless
                visible={isOpenEmojiPicker}
                interactive={true}
                offset={[-200, 10]}
                delay={[100, 300]}
                placement="top-start"
                render={(attrs) => (
                  <div className="box" tabIndex="-1" {...attrs}>
                    <div className={cx('emoji-picker')} onClick={(e) => e.stopPropagation()}>
                      <EmojiPicker
                        onEmojiClick={(e) => {
                          setCommentText((prev) => prev + e.emoji);
                        }}
                      />
                    </div>
                  </div>
                )}
              >
                <button
                  className={cx('option-btn')}
                  onClick={() => {
                    setIsOpenEmojiPicker((prev) => !prev);
                  }}
                >
                  <FontAwesomeIcon icon={faFaceLaugh} />
                </button>
              </TippyHeadless> */}

              <button className={cx('option-btn')} onClick={handleSubmit}>
                <RightShiftArrowIcon height="2.8rem" width="2.8rem" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommentContainer;
