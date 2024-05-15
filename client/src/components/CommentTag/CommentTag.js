import classNames from 'classnames/bind';
import styles from './CommentTag.module.scss';
import moment from 'moment';
import MediaItem from '../MediaItem/MediaItem';
import { useContext, useEffect, useRef, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import { AxiosInstanceContext } from '../AxiosInterceptorWrapper/AxiosInterceptorWrapper';
import Cookies from 'universal-cookie';
import { IsLoadingContext } from '~/Context/IsLoadingContext';
import { isImage, isVideo } from '~/UserDefinedFunctions';
import { RightShiftArrowIcon } from '../Icons';
import useOutsideAlerter from '~/hooks/useOutsideAlerter';
import CommentEditting from './CommentEditting/CommentEditting';
import { CheckingLayerContext } from '~/Context/CheckingLayerContext';
import { useNavigate } from 'react-router-dom';
import MediaItem2 from '../MediaItem2/MediaItem2';

const cx = classNames.bind(styles);
const cookies = new Cookies();

function CommentTag({
  comment_id,
  type,
  content,
  author_avatar,
  comment_author_id,
  post_author_id,
  author_name,
  created_at,
  is_edited,
  className,
  setComments,
  edittingComment,
  setEdittingComment,
  setCommentEditedSignal,
}) {
  const navigate = useNavigate();

  const userInfoContext = useContext(UserInfoContext);
  const user = userInfoContext.user;

  // USE_REF
  const textInpRef = useRef();
  const edittingContainerRef = useRef();

  // USE_CONTEXT
  const axiosInstanceContext = useContext(AxiosInstanceContext);
  const axiosInstance = axiosInstanceContext;

  const isLoadingContext = useContext(IsLoadingContext);
  const isLoading = isLoadingContext.isLoading;
  const setIsLoading = isLoadingContext.setIsLoading;

  const checkingLayerContext = useContext(CheckingLayerContext);
  const setFunctionHandlers = checkingLayerContext.setFunctionHandlers;

  // USE_STATE
  const [shortTextContent, setShortTextContent] = useState(content.slice(0, 56));

  useEffect(() => {
    setShortTextContent(content.slice(0, 56));
  }, [content]);

  // USE_EFFECT
  useEffect(() => {
    if (content.split(/\r\n|\r|\n/).length > 4) {
      setShortTextContent(content.split('\n').slice(0, 4).join('\n'));
    }
  }, [content]);

  // FUNCTION_HANDLER

  const renderContent = () => {
    if (type == 'image') {
      return <MediaItem type="image" src={content} large removable={false} />;
    } else if (type == 'video') {
      return <MediaItem type="video" src={content} large removable={false} />;
    } else {
      return (
        <>
          <h4 className={cx('content')}>{shortTextContent}</h4>
          {shortTextContent.length < content.length && <span>... </span>}
          {shortTextContent.length < content.length && (
            <button className={cx('adjust-content-length-btn')} onClick={handleExpandContent}>
              See more
            </button>
          )}
          {shortTextContent.length == content.length &&
            (content.split(/\r\n|\r|\n/).length > 4 || content.length > 56) && (
              <button className={cx('adjust-content-length-btn')} onClick={handleShrinkContent}>
                See less
              </button>
            )}
        </>
      );
    }
  };

  const handleExpandContent = () => {
    setShortTextContent(content);
  };

  const handleShrinkContent = () => {
    if (content.split(/\r\n|\r|\n/).length > 4) {
      setShortTextContent(content.split('\n').slice(0, 4).join('\n'));
    } else {
      setShortTextContent(content.slice(0, 56));
    }
  };

  const _handleDeleteComment = () => {
    setIsLoading(true);

    const payload = {
      comment_id: comment_id,
    };

    const configurations = {
      data: payload,
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };

    axiosInstance
      .delete(`/posts/comments/${comment_id}`, configurations)
      .then((result) => {
        setIsLoading(false);
        setComments((prev) => prev.filter((comment) => comment.comment_id !== comment_id));
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDeleteComment = () => {
    setFunctionHandlers({
      alert_title: 'Delete Comment?',
      alert_content: 'Are you sure you want to delete this comment?',
      confirmFunction: () => {
        _handleDeleteComment();
      },
    });
  };

  const handleOpenProfile = (user_id) => {
    navigate(`/profiles/${user_id}/posts`, { replace: true });
  };

  return (
    <div ref={edittingContainerRef} className={cx('wrapper', { [className]: className })}>
      {edittingComment?.comment_id !== comment_id && (
        <>
          <div className={cx('container')}>
            <MediaItem2
              item={{ url: author_avatar, type: 'image' }}
              width={32}
              height={32}
              border_radius={1000}
              _styles={{
                boxShadow: 'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px',
              }}
              className={cx('author-avatar')}
            />
            <div className={cx('comment-info')}>
              <button className={cx('author-name')} onClick={() => handleOpenProfile(comment_author_id)}>
                {author_name}
              </button>
              {renderContent()}
            </div>
          </div>
          <div className={cx('interactions')}>
            {comment_author_id === user.user_id && (
              <>
                <button className={cx('delete-btn')} onClick={handleDeleteComment}>
                  Delete
                </button>
                <button
                  className={cx('delete-btn')}
                  onClick={(e) => {
                    setEdittingComment({ comment_id: comment_id });
                  }}
                >
                  Edit
                </button>
              </>
            )}

            <span className={cx('time-stamp')}>{moment(created_at).fromNow()}</span>
            {is_edited ? <span className={cx('is_edited')}>edited</span> : <></>}
          </div>
        </>
      )}
      {edittingComment?.comment_id === comment_id && (
        <CommentEditting
          comment_id={comment_id}
          type={type}
          content={content}
          author_avatar={author_avatar}
          user_id={comment_author_id}
          author_name={author_name}
          created_at={created_at}
          setEdittingComment={setEdittingComment}
          setCommentEditedSignal={setCommentEditedSignal}
        />
      )}
    </div>
  );
}

export default CommentTag;
