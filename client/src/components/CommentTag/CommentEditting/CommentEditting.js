import classNames from 'classnames/bind';
import styles from './CommentEditting.module.scss';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { RightShiftArrowIcon } from '~/components/Icons';
import { AxiosInstanceContext } from '~/components/AxiosInterceptorWrapper/AxiosInterceptorWrapper';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import Cookies from 'universal-cookie';
import { IsLoadingContext } from '~/Context/IsLoadingContext';
import MediaItem from '~/components/MediaItem/MediaItem';
import { isImage, isVideo } from '~/UserDefinedFunctions';

const cx = classNames.bind(styles);
const cookies = new Cookies();

function CommentEditting({
  comment_id,
  type,
  content,
  author_avatar,
  user_id,
  author_name,
  created_at,
  setEdittingComment,
  setCommentEditedSignal,
}) {
  // USE_REF
  const textInpRef = useRef();
  const fileInputRef = useRef();

  // USE_CONTEXT
  const userInfoContext = useContext(UserInfoContext);
  const user = userInfoContext.user;

  const axiosInstanceContext = useContext(AxiosInstanceContext);
  const axiosInstance = axiosInstanceContext;

  const isLoadingContext = useContext(IsLoadingContext);
  const setIsLoading = isLoadingContext.setIsLoading;

  // USE_STATE
  const [newContent, setNewContent] = useState(content);
  const [file, setFile] = useState();
  const [fileData, setFileData] = useState();

  // FUNCTION_HANDLER

  const handleKey = (e) => {
    if (e.code === 'Enter') {
      e.preventDefault();
      handleEditComment();
    }
  };

  const handleEditComment = () => {
    setIsLoading(true);
    const payload = {
      comment_id,
      new_comment: newContent,
    };

    const configurations = {
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };

    axiosInstance
      .put(`/posts/comments/${comment_id}`, payload, configurations)
      .then((result) => {
        setCommentEditedSignal((prev) => !prev);
        setEdittingComment();
        setIsLoading(false);
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCancelEdit = () => {
    setEdittingComment();
  };

  const handleSubmitMedia = () => {
    setIsLoading(true);

    const formData = new FormData();

    formData.append('comment_id', comment_id);

    if (newContent) {
      formData.append('new_comment', newContent);
    }

    if (file) {
      formData.append('uploading-media', file);
    }

    const configurations = {
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };

    axiosInstance
      .put(`/posts/comments/${comment_id}`, formData, configurations)
      .then((result) => {
        setCommentEditedSignal((prev) => !prev);
        setEdittingComment();
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const callbackRef = useCallback((inputElement) => {
    if (inputElement) {
      inputElement.focus();
    }
  }, []);

  return (
    <div className={cx('wrapper')}>
      <>
        <div className={cx('container')}>
          <img className={cx('author-avatar')} alt="" src={author_avatar} />
          {type === 'text' && (
            <div className={cx('typer-area')}>
              <div className={cx('content-area')}>
                <textarea
                  ref={callbackRef}
                  value={newContent}
                  placeholder="Write a comment"
                  spellCheck={false}
                  className={cx('comment-inp')}
                  onChange={(e) => {
                    setNewContent(e.target.value);
                  }}
                  onKeyDown={handleKey}
                  onFocus={(e) =>
                    e.currentTarget.setSelectionRange(e.currentTarget.value.length, e.currentTarget.value.length)
                  }
                />
              </div>
              <button className={cx('option-btn')} onClick={handleEditComment}>
                <RightShiftArrowIcon height="2.8rem" width="2.8rem" />
              </button>
            </div>
          )}
          {type !== 'text' && (
            <div className={cx('media-editing-area')} onClick={() => fileInputRef?.current.click()}>
              <input
                ref={fileInputRef}
                className={cx('file-inp')}
                type="file"
                accept=".jpg, .mp4, .png"
                onChange={(e) => {
                  let is_image = isImage(e.target.files[0].name);
                  let is_video = isVideo(e.target.files[0].name);
                  let type = undefined;
                  if (is_image) {
                    type = 'image';
                  } else if (is_video) {
                    type = 'video';
                  }
                  setFileData({ file_url: URL.createObjectURL(e.target.files[0]), type: type });
                  setFile(e.target.files[0]);
                }}
              />
              {!file && (
                <>
                  <img className={cx('photo-icon')} alt="" src={require('../../../assets/images/filled_photo.png')} />
                  <h3 className={cx('media-uploading-title')}>Add you media</h3>
                </>
              )}
              {file && <MediaItem className={cx('preview-media')} type={fileData.type} src={fileData.file_url} />}
            </div>
          )}
        </div>
        <div className={cx('options')}>
          <button className={cx('cancel-edit-btn')} onClick={handleCancelEdit}>
            Cancel
          </button>
          {file && (
            <button className={cx('submit-edit-btn')} onClick={handleSubmitMedia}>
              Submit
            </button>
          )}
        </div>
      </>
    </div>
  );
}

export default CommentEditting;
