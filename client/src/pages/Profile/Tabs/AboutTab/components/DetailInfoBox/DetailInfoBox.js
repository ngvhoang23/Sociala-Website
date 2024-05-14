import classNames from 'classnames/bind';
import styles from './DetailInfoBox.module.scss';
import UserAboutBox from '~/components/UserAboutBox/UserAboutBox';
import Overview from '~/components/UserAboutBox/Tabs/Overview/Overview';
import ContactAndBasicInfo from '~/components/UserAboutBox/Tabs/ContactAndBasicInfo/ContactAndBasicInfo';
import DetailAbout from '~/components/UserAboutBox/Tabs/DetailAbout/DetailAbout';

const cx = classNames.bind(styles);

function DetailInfoBox() {
  const tabs = [
    { code: 'overview', element: <Overview />, title: 'Overview' },
    { code: 'contact_and_basic_info', element: <ContactAndBasicInfo />, title: 'Contact and basic info' },
    { code: 'detail', element: <DetailAbout />, title: 'Detail' },
  ];

  return <UserAboutBox tabs={tabs} />;
}

export default DetailInfoBox;
