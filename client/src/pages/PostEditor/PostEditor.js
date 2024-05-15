import classNames from 'classnames/bind';
import styles from './PostEditor.module.scss';
import Cookies from 'universal-cookie';
import { useContext, useEffect, useRef, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import moment from 'moment';
import { DocumentIcon, PhotoIcon } from '~/components/Icons';
import DocLayout from './components/DocLayout/DocLayout';
import MediaLayout from './components/MediaLayout/MediaLayout';
import SharedPostContent from '~/components/SharedPostContent';
import { useParams } from 'react-router-dom';
import { AxiosInstanceContext } from '~/components/AxiosInterceptorWrapper/AxiosInterceptorWrapper';
import InputItem from '~/components/InputItem';

const cx = classNames.bind(styles);
const cookies = new Cookies();

function PostEditor() {
  const userInfoContext = useContext(UserInfoContext);
  const user = userInfoContext.user;

  const axiosInstanceContext = useContext(AxiosInstanceContext);
  const axiosInstance = axiosInstanceContext;

  // USE_PARAM
  const { post_id } = useParams();

  // USE_REF
  const mediaUploadInpRef = useRef();
  const docsUploadInpRef = useRef();

  // USE_STATE
  const [textContent, setTextContent] = useState('');
  const [uploadedMedia, setUploadedMedia] = useState([]);
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [postInfo, setPostInfo] = useState();
  const [files, setFiles] = useState([]);

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
        setTextContent(postInfo.text_content);
        setFiles(result.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [post_id]);

  useEffect(() => {
    setUploadedMedia(postInfo?.files?.filter((file) => file.type == 'image' || file.type == 'video') || []);
    setUploadedDocs(postInfo?.files?.filter((file) => file.type == 'document') || []);
  }, [postInfo?.files]);

  // FUNCTION_HANDLER
  const handleSubmit = () => {
    if (uploadedMedia.length == 0 && !textContent && uploadedDocs.length == 0) {
      alert('post-is-empty');
      return;
    }

    const formData = new FormData();

    formData.append('text_content', textContent.trim());
    formData.append('post_id', postInfo.post_id);

    let rest_files = uploadedMedia?.filter((mediaItem) => !(mediaItem instanceof File));
    rest_files = rest_files.concat(uploadedDocs?.filter((docItem) => !(docItem instanceof File)));

    formData.append('rest_files', JSON.stringify(rest_files));

    !postInfo?.ref_post_id &&
      uploadedMedia.forEach((mediaItem) => {
        formData.append('upload-files', mediaItem);
      });

    !postInfo?.ref_post_id &&
      uploadedDocs.forEach((docItem) => {
        formData.append('upload-files', docItem);
      });

    // CONFIG MULTIPART FORM
    const config = {
      headers: { 'content-type': 'multipart/form-data', Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}` },
    };

    axiosInstance
      .put(`/posts/:${postInfo.post_id}`, formData, config)
      .then((result) => {
        window.location.href = `/new-feeds`;
      })
      .catch((error) => console.log(error));
  };

  const handleMediaChange = (e) => {
    setUploadedMedia((prev) => [...prev, ...e.target.files]);
  };

  const handleDocumentChange = (e) => {
    setUploadedDocs((prev) => [...prev, ...e.target.files]);
  };

  return (
    <div className={cx('wrapper')}>
      <div className={cx('container')}>
        <div className={cx('header')}>
          <div className={cx('author-info')}>
            <img className={cx('author-avatar')} src={postInfo?.author_avatar} alt="" />
            <div>
              <p className={cx('author-name')}>{postInfo?.author_full_name}</p>
              <p className={cx('time-stamp')}>{postInfo?.created_at ? moment(postInfo?.created_at).fromNow() : ''}</p>
            </div>
          </div>
        </div>
        <div className={cx('body')}>
          <div className={cx('post-content')}>
            <InputItem
              required
              className={cx('text-content-inp')}
              placeholder={'Text Content ...'}
              name="post_text_content"
              value={textContent}
              type="text"
              rows={4}
              onChange={(e) => {
                setTextContent(e.target.value);
              }}
              input_type="text_area"
            />
          </div>
          <div className={cx('options-container')}>
            <span className={cx('options-lable')}>Add Photos/Documents</span>
            <button
              className={cx('photo-btn')}
              onClick={() => {
                mediaUploadInpRef.current.click();
              }}
            >
              <PhotoIcon className={cx('photo-icon')} height="2.4rem" width="2.4rem" />
              <p className={cx('btn-title')}>Photo/Video</p>
            </button>
            <button
              className={cx('document-btn')}
              onClick={() => {
                docsUploadInpRef.current.click();
              }}
            >
              <DocumentIcon className={cx('document-icon')} height="2.4rem" width="2.4rem" />
              <p className={cx('btn-title')}>Attached files</p>
            </button>
          </div>
          {!postInfo?.ref_post_id && (
            <>
              {uploadedDocs?.length > 0 && (
                <div className={cx('docs-container')}>
                  <DocLayout files={uploadedDocs} setDocs={setUploadedDocs} />
                </div>
              )}
              {uploadedMedia?.length > 0 && (
                <div className={cx('media-container')}>
                  <MediaLayout post_id={post_id} files={uploadedMedia} setMedia={setUploadedMedia} />
                </div>
              )}
            </>
          )}

          {postInfo?.ref_post_id && <SharedPostContent post_id={postInfo?.ref_post_id} />}
        </div>
        {!postInfo?.ref_post_id && (
          <div className={cx('footer')}>
            <input
              ref={mediaUploadInpRef}
              className={cx('upload-inp')}
              type="file"
              accept=".jpg, .mp4, .png"
              multiple
              onChange={handleMediaChange}
            />

            <input
              ref={docsUploadInpRef}
              className={cx('upload-inp')}
              type="file"
              accept=".docx, .xlsx, .pdf, .pptx, .txt"
              multiple
              onChange={handleDocumentChange}
            />
          </div>
        )}
        <button className={cx('submit-btn')} onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
}

export default PostEditor;
