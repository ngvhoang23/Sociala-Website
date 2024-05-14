import classNames from 'classnames/bind';
import styles from './StoryCreationBtn.module.scss';
import { PlusIcon } from '../Icons';

const cx = classNames.bind(styles);

function StoryCreationBtn({ onClick }) {
  return (
    <div className={cx('wrapper')} onClick={onClick}>
      <div className={cx('bg-image')}></div>
      <div className={cx('author-info')}>
        <div className={cx('plus-btn')}>
          <PlusIcon width={'2rem'} height={'2rem'} />
        </div>
        <p className={cx('author-name')}>Story Creation</p>
      </div>
    </div>
  );
}

export default StoryCreationBtn;
