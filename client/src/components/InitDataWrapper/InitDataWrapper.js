import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import { AxiosInstanceContext } from '../AxiosInterceptorWrapper/AxiosInterceptorWrapper';

function InitDataWrapper({ children }) {
  return <div>{children}</div>;
}

export default InitDataWrapper;
