import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import Account from '~/Account/Account';

import MainLayout from '~/MainLayout/MainLayout';
import AxiosInterceptorWrapper, {
  AxiosInstanceContext,
} from '~/components/AxiosInterceptorWrapper/AxiosInterceptorWrapper';
import ContextWrapper from '~/components/ContextWrapper/ContextWrapper';
import GlobalModals from '~/components/GlobalModals';
import InitDataWrapper from '~/components/InitDataWrapper/InitDataWrapper';
import LogicWrapper from '~/components/LogicWrapper/LogicWrapper';
import UpdateProfile from '~/pages/UpdateProfile';
const cookies = new Cookies();

export const UserInfoContext = createContext();

// receives component and any other props represented by ...rest
export default function ProtectedRoutes({ component: Component, children, ...rest }) {
  const axiosInstanceContext = useContext(AxiosInstanceContext);
  const axiosInstance = axiosInstanceContext;

  const [user, setUser] = useState(null);
  const [userPrivacy, setUserPrivacy] = useState(null);

  useEffect(() => {
    const config = {
      headers: { Authorization: `Bearer ${cookies.get('ACCESS_TOKEN')}` },
    };

    cookies.get('ACCESS_TOKEN') &&
      axiosInstance
        .get(`/users/user-info`, config)
        .then((result) => {
          let { user_info, privacy_info } = result.data;
          if (user_info?.user_id) {
            setUser(user_info);
            setUserPrivacy(privacy_info);
          } else {
            setUser(-1);
          }
        })
        .catch((error) => {
          console.log(error);
        });
  }, [cookies.get('ACCESS_TOKEN')]);

  const render = () => {
    if (cookies.get('ACCESS_TOKEN') && user?.user_id) {
      return (
        <UserInfoContext.Provider value={{ user: user, user_privacy: userPrivacy, setUser: setUser }}>
          <InitDataWrapper>
            <ContextWrapper>
              <LogicWrapper>
                <GlobalModals></GlobalModals>
                <MainLayout>{children}</MainLayout>
              </LogicWrapper>
            </ContextWrapper>
          </InitDataWrapper>
        </UserInfoContext.Provider>
      );
    } else if (cookies.get('ACCESS_TOKEN') && user == -1) {
      return <UpdateProfile />;
    } else if (!cookies.get('ACCESS_TOKEN')) {
      return <Account />;
    } else {
      return <></>;
    }
  };

  return <>{render()}</>;
}
