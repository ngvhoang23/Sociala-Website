import classNames from 'classnames/bind';
import styles from './UserAboutBox.module.scss';
import AddUserInfoItem from './components/AddUserInfoItem';
import UserInfoForm from './components/UserInfoForm/UserInfoForm';
import ContactAndBasicInfo from './Tabs/MyContactAndBasicInfo/MyContactAndBasicInfo';
import { useState } from 'react';
import DetailAbout from './Tabs/MyDetailAbout/MyDetailAbout';
import Overview from './Tabs/MyOverview/MyOverview';

const cx = classNames.bind(styles);

function UserAboutBox({ tabs }) {
  const [tabCode, setTabCode] = useState(tabs?.length > 0 ? tabs[0]?.code : undefined);

  const renderTab = () => {
    let Comp = <></>;
    tabs?.forEach((tab) => {
      if (tab.code === tabCode) {
        Comp = tab.element;
        return;
      }
    });
    return Comp;
  };

  return (
    <div className={cx('wrapper')}>
      <div className={cx('nav-container')}>
        <div className={cx('nav-header')}>
          <h3 className={cx('nav-header-title')}>About</h3>
        </div>
        {tabs?.map((tab) => {
          return (
            <button
              key={tab.code}
              className={cx('nav-item', { active: tabCode === tab.code })}
              onClick={() => setTabCode(tab.code)}
            >
              {tab.title}
            </button>
          );
        })}
      </div>
      <div className={cx('body')}>{renderTab()}</div>
    </div>
  );
}

export default UserAboutBox;
