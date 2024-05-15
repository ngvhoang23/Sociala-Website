import classNames from 'classnames/bind';
import styles from './StoryContent.module.scss';
import StoryItem from '../StoryItem';
import StoryCreationBtn from '../StoryCreationBtn';
import StoryCreationModal from '../StoryCreationModal';
import { useContext, useEffect, useState } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import axios from 'axios';
import Cookies from 'universal-cookie';
import StoryPreviewModal from '../StoryPreviewModal';
import { CloseIcon } from '../Icons';
import { StoryPreviewContext } from '~/Context/StoryPreviewContext';
import { IsOpenStoryGeneratorContext } from '~/Context/IsOpenStoryGeneratorContext';
import { AxiosInstanceContext } from '../AxiosInterceptorWrapper/AxiosInterceptorWrapper';
import { NeedToReLoadContext } from '~/Context/NeedToReLoadContext';

const cookies = new Cookies();
const cx = classNames.bind(styles);

function StoryContent({ className }) {
  // CONSTANCE
  const userInfoContext = useContext(UserInfoContext);
  const user = userInfoContext.user;

  // USE_CONTEXT
  const storyPreviewContext = useContext(StoryPreviewContext);
  const storyPreview = storyPreviewContext.storyPreview;
  const setStoryPreview = storyPreviewContext.setStoryPreview;

  const isOpenStoryGeneratorContext = useContext(IsOpenStoryGeneratorContext);
  const isOpenStoryGenerator = isOpenStoryGeneratorContext.isOpen;
  const setIsOpenStoryGenerator = isOpenStoryGeneratorContext.setIsOpen;

  const axiosInstanceContext = useContext(AxiosInstanceContext);
  const axiosInstance = axiosInstanceContext;

  const needToReLoadSignalContext = useContext(NeedToReLoadContext);
  const reLoadingSignal = needToReLoadSignalContext.reLoadingSignal;
  const setReLoadingSignal = needToReLoadSignalContext.setReLoadingSignal;

  // USE_STATE
  const [stories, setStories] = useState([]);
  const [storyData, setStoryData] = useState([]);

  // USE_EFFECT

  useEffect(() => {
    setStories([]);
  }, [reLoadingSignal.status]);

  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}`,
      },
    };

    setTimeout(() => {
      axiosInstance
        .get(`/stories`, config)
        .then((result) => {
          setReLoadingSignal((prev) => ({ ...prev, stories: true }));
          setStories(result.data);
        })
        .catch((error) => {
          error = new Error();
        });
    }, 0);
  }, [reLoadingSignal.status]);

  useEffect(() => {
    let storyData = [];

    stories.forEach((story, index) => {
      const ind = storyData.findIndex((item) => item[0].author_id == story.author_id);
      if (ind != -1) {
        storyData[ind].push(story);
      } else {
        storyData.push([story]);
      }
    });

    setStoryData(storyData);
  }, [stories]);

  // FUNCTION_HANDLER
  const renderStories = () => {
    return storyData.map((story, index) => {
      return (
        <StoryItem
          className={cx('story-item')}
          key={story[0].author_id}
          backgroundImage={`url(${story[0].thumbnail})`}
          thumbnail={story[0].thumbnail}
          story_list={story}
          author_avatar={story[0].author_avatar}
          author_name={story[0].author_name}
          remaining_time={story[0].remaining_time}
          onClick={() =>
            setStoryPreview({
              index,
              story_list: story,
              author_id: story[0].author_id,
              storyData: storyData,
            })
          }
        />
      );
    });
  };

  return (
    <div className={cx('wrapper', { [className]: className })}>
      <div className={cx('container')}>
        <StoryCreationBtn onClick={() => setIsOpenStoryGenerator(true)} />
        {renderStories()}
      </div>
    </div>
  );
}

export default StoryContent;
