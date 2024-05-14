import classNames from 'classnames/bind';
import styles from './PostCreation.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faPhotoFilm, faVideo, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faFile } from '@fortawesome/free-regular-svg-icons';
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { useContext, useEffect, useRef, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import { formatFileSize, isImage, isVideo } from '~/UserDefinedFunctions';
import { CloseIcon, DocumentIcon, FileIcon, PhotoIcon } from '../Icons';
import Cookies from 'universal-cookie';
import axios from 'axios';
import moment from 'moment';
import LoadingModal from '../LoadingModal';
import AlertModal from '../AlertModal';
import SharedPostContent from '../SharedPostContent';
import { SocketContext } from '~/Context/SocketContext';
import FileItem from '../FileItem';
import MediaItem from '../MediaItem/MediaItem';
import { IsOpenPostGeneratorContext } from '~/Context/IsOpenPostGeneratorContext';
import { AxiosInstanceContext } from '../AxiosInterceptorWrapper/AxiosInterceptorWrapper';
import { IsLoadingContext } from '~/Context/IsLoadingContext';
import MediaItem2 from '../MediaItem2/MediaItem2';

const cx = classNames.bind(styles);
const cookies = new Cookies();

function PostCreation({
  ref_author_id,
  ref_created_at,
  ref_full_name,
  ref_post_id,
  ref_text_content,
  ref_user_avatar,
  ref_user_name,
  files,
  className,
  onClick,
  onClose,
}) {
  const userInfoContext = useContext(UserInfoContext);
  const user = userInfoContext.user;

  // USE_REF
  const mediaUploadInpRef = useRef();
  const docsUploadInpRef = useRef();

  // USE_CONTEXT
  const socket = useContext(SocketContext);

  const isOpenPostGeneratorContext = useContext(IsOpenPostGeneratorContext);
  const isOpenPostGenerator = isOpenPostGeneratorContext.isOpen;
  const setIsOpenPostGenerator = isOpenPostGeneratorContext.setIsOpen;

  const axiosInstanceContext = useContext(AxiosInstanceContext);
  const axiosInstance = axiosInstanceContext;

  // USE_STATE
  const [uploadedMedia, setUploadedMedia] = useState([]);
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [uploadedMediaDetail, setUploadedMediaDetail] = useState([]);
  const [postTitle, setPostTitle] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [alertEmptyPost, setAlertEmptyPost] = useState(false);
  const [friends, setFriends] = useState([]);

  // USE_EFFECT
  useEffect(() => {
    const params = {
      queried_user_id: user.user_id,
    };

    const configurations = {
      params: params,
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };

    axiosInstance
      .get(`/users/friends`, configurations)
      .then((result) => {
        setFriends(result.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [user?.user_id]);

  // FUNCTION_HANDLER

  const handleMediaChange = (e) => {
    let files = [...e?.target?.files];

    if (files?.some((file) => file.size / 1000000 > 25)) {
      alert('require file size less than 25MB');
      return;
    }
    setUploadedMedia((prev) => [...prev, ...files]);
    setUploadedMediaDetail(
      files.map((file) => {
        return { size: file.size, name: file.name, src: URL.createObjectURL(file) };
      }),
    );
  };

  const handleDocumentChange = (e) => {
    const files = [...e?.target?.files];

    if (files?.some((file) => file.size / 1000000 > 25)) {
      alert('require file size less than 25MB');
      return;
    }
    setUploadedDocs((prev) => [...prev, ...e.target.files]);
  };

  const handleSubmit = () => {
    if (uploadedMedia.length == 0 && !postTitle && uploadedDocs.length == 0) {
      setAlertEmptyPost(true);
      return;
    }
    setIsPosting(true);
    const formData = new FormData();

    formData.append('text_content', postTitle.trim());
    formData.append('created_at', moment().valueOf());

    uploadedMedia.forEach((mediaItem) => {
      formData.append('upload-files', mediaItem);
    });

    uploadedDocs.forEach((docItem) => {
      formData.append('upload-files', docItem);
    });

    // CONFIG MULTIPART FORM
    const config = {
      headers: { 'content-type': 'multipart/form-data', Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}` },
    };

    axiosInstance
      .post(`/posts`, formData, config)
      .then((result) => {
        const inserted_post_id = result.data.inserted_post_id;
        return new Promise((resolve, reject) => {
          const target_user_ids = friends.map((friend) => friend.user_id);

          const payload = {
            user_id: user.user_id,
            target_user_ids: target_user_ids,
            defined_noti_id: 'noti_03',
            post_id: inserted_post_id,
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
              resolve(inserted_post_id);
            })
            .catch((err) => {
              reject(err);
            });
        });
      })
      .then((result) => {
        const inserted_post_id = result;
        const target_user_ids = friends.map((friend) => friend.user_id);
        socket?.emit('new-post', {
          post_id: inserted_post_id,
          target_user_ids: target_user_ids,
          author_id: user.user_id,
          created_at: moment().valueOf(),
        });
        setIsPosting(false);
        window.location.reload(false);
      })
      .catch((error) => console.log(error));
  };

  const handleSharePost = () => {
    setIsPosting(true);

    const payload = {
      ref_post_id: ref_post_id,
      text_content: postTitle,
      created_at: moment().valueOf(),
    };

    const configurations = {
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };

    axiosInstance
      .post(`/posts/sharing`, payload, configurations)
      .then((result) => {
        window.location.reload(false);
      })
      .catch((error) => {
        error = new Error();
      });
  };

  useEffect(() => {
    console.log(uploadedMediaDetail);
  }, [uploadedMediaDetail]);

  return (
    <div className={cx('wrapper', { [className]: className })} onClick={onClick}>
      <div className={cx('header')}>
        <button className={cx('create-post-btn')}>
          <span className={cx('create-icon-container')}>
            <FontAwesomeIcon className={cx('create-icon')} icon={faPenToSquare} />
          </span>
          <p className={cx('create-post-btn-title')}>Create Post</p>
        </button>
        <button
          className={cx('close-btn')}
          onClick={() => {
            setIsOpenPostGenerator(false);
            onClose && onClose();
          }}
        >
          <CloseIcon height="2.4rem" width="2.4rem" />
        </button>
      </div>
      <div className={cx('body')}>
        <MediaItem2
          item={{ url: user.user_avatar, type: 'image' }}
          width={40}
          height={40}
          border_radius={1000}
          _styles={{
            boxShadow: 'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px',
          }}
          className={cx('user-avatar')}
        />
        <textarea
          placeholder={'What is on your mind'}
          className={cx('type-area')}
          rows={Math.ceil(postTitle.length / 71)}
          spellCheck={false}
          value={postTitle}
          onChange={(e) => {
            setPostTitle(e.target.value);
          }}
        />
        {ref_post_id && (
          <SharedPostContent
            post_id={ref_post_id}
            author_avatar={ref_user_avatar}
            author_full_name={ref_full_name}
            text_content={ref_text_content}
            files={files}
            created_at={ref_created_at}
            in_template
          />
        )}
        {!ref_post_id && (
          <div className={cx('upload-container')}>
            {uploadedMedia.length > 0 && (
              <div className={cx('uploaded-media')}>
                <div className={cx('media-header')}>
                  <button
                    className={cx('clear-all-btn')}
                    onClick={() => {
                      setUploadedMedia([]);
                    }}
                  >
                    <FontAwesomeIcon className={cx('clear-all-icon')} icon={faXmark} />
                    Clear All
                  </button>
                </div>
                <div className={cx('media-content')}>
                  {uploadedMediaDetail?.map((mediaItem, index) => {
                    if (isImage(mediaItem.name)) {
                      return (
                        <MediaItem
                          className={cx('media-item')}
                          key={index}
                          type="image"
                          large
                          src={mediaItem.src}
                          removable
                          onRemove={() => {
                            setUploadedMedia((prev) =>
                              prev.filter((media, media_index) => media.name != mediaItem.name),
                            );

                            setUploadedMediaDetail((prev) =>
                              prev.filter((media, media_index) => media.name != mediaItem.name),
                            );
                          }}
                          width={164}
                          height={164}
                        />
                      );
                    } else if (isVideo(mediaItem.name)) {
                      return (
                        <MediaItem
                          className={cx('media-item')}
                          key={index}
                          type="video"
                          src={mediaItem.src}
                          name={mediaItem.name}
                          removable
                          onRemove={() => {
                            setUploadedMedia((prev) =>
                              prev.filter((media, media_index) => media.name != mediaItem.name),
                            );
                            setUploadedMediaDetail((prev) =>
                              prev.filter((media, media_index) => media.name != mediaItem.name),
                            );
                          }}
                          width={164}
                          height={164}
                        />
                      );
                    }
                  })}
                </div>
              </div>
            )}
            {uploadedDocs.length > 0 && (
              <div className={cx('uploaded-docs')}>
                <div className={cx('docs-header')}>
                  <button
                    className={cx('clear-all-btn')}
                    onClick={() => {
                      setUploadedDocs([]);
                    }}
                  >
                    <FontAwesomeIcon className={cx('clear-all-icon')} icon={faXmark} />
                    Clear All
                  </button>
                </div>
                <div className={cx('docs-content')}>
                  {uploadedDocs?.map((docItem, index) => {
                    return (
                      <FileItem
                        key={index}
                        className={cx('doc-item')}
                        file_name={docItem.name}
                        file_size={docItem.size}
                        removable
                        onRemove={() => {
                          setUploadedDocs((prev) => prev.filter((doc, doc_index) => doc_index != index));
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <div className={cx('footer')}>
        {!ref_post_id && (
          <div className={cx('options-container')}>
            <p className={cx('option-title')}>Add to your post</p>
            <div className={cx('options')}>
              <button
                className={cx('tool-btn')}
                onClick={() => {
                  mediaUploadInpRef.current.click();
                  if (mediaUploadInpRef?.current?.value) {
                    mediaUploadInpRef.current.value = null;
                  }
                }}
              >
                <input
                  ref={mediaUploadInpRef}
                  className={cx('upload-inp')}
                  type="file"
                  accept=".jpg, .mp4, .png"
                  multiple
                  onChange={handleMediaChange}
                />
                <PhotoIcon className={cx('photo-icon')} />
                <p className={cx('btn-title')}>Photo/Video</p>
              </button>
              <button
                className={cx('tool-btn')}
                onClick={() => {
                  docsUploadInpRef.current.click();
                  if (docsUploadInpRef?.current?.value) {
                    docsUploadInpRef.current.value = null;
                  }
                }}
              >
                <input
                  ref={docsUploadInpRef}
                  className={cx('upload-inp')}
                  type="file"
                  accept=".docx, .xlsx, .pdf, .pptx, .txt"
                  multiple
                  onChange={handleDocumentChange}
                />
                <DocumentIcon className={cx('document-icon')} />
                <p className={cx('btn-title')}>Attached files</p>
              </button>
            </div>
          </div>
        )}
        {(postTitle || uploadedDocs.length > 0 || uploadedMedia.length > 0 || ref_post_id) && (
          <button
            className={cx('sumbit-btn')}
            onClick={() => {
              if (ref_post_id) {
                handleSharePost();
              } else {
                handleSubmit();
              }
            }}
          >
            POST
          </button>
        )}
      </div>
      {isPosting && <LoadingModal />}
      {alertEmptyPost && (
        <AlertModal setIsShowAlert={setAlertEmptyPost}>
          <p>Your post is empty!</p>
        </AlertModal>
      )}
    </div>
  );
}

export default PostCreation;
