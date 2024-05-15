import classNames from 'classnames/bind';
import styles from './AboutTab.module.scss';
import UserAboutBox from '~/components/UserAboutBox/UserAboutBox';
import DetailAbout from '~/components/UserAboutBox/Tabs/MyDetailAbout/MyDetailAbout';
import DetailInfoBox from './components/DetailInfoBox/DetailInfoBox';

const cx = classNames.bind(styles);

function AboutTab() {
  return (
    <div className={cx('wrapper')}>
      <DetailInfoBox />
    </div>
  );
}

export default AboutTab;
