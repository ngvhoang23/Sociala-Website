import classNames from 'classnames/bind';
import styles from './App.module.scss';

import { Route, Routes, ScrollRestoration } from 'react-router-dom';
import Login from './pages/Login/Login';
import Register from './pages/Register';
import ProtectedRoutes from './AuthComponent/ProtectedRoutes';
import MyProfile from './pages/MyProfile';
import NewFeeds from './pages/NewFeeds/NewFeeds';
import ProfileChanger from './pages/ProfileChanger';
import MyPostsTab from './pages/MyProfile/Tabs/PostsTab';
import MyFriendsTab from './pages/MyProfile/Tabs/FriendsTab';
import MyPhotosTab from './pages/MyProfile/Tabs/PhotosTab';
import Contacts from './pages/Contacts';
import AllFriendsTab from './pages/Contacts/Tabs/AllFriendsTab/AllFriendsTab';
import FriendRequestsTab from './pages/Contacts/Tabs/FriendRequestsTab';
import SuggestionsTab from './pages/Contacts/Tabs/SuggestionsTab';
import ContactProfile from './pages/Profile';
import ContactAboutTab from './pages/Profile/Tabs/AboutTab';
import ContactPostTab from './pages/Profile/Tabs/PostsTab';
import ContactFriendsTab from './pages/Profile/Tabs/FriendsTab';
import ContactPhotosTab from './pages/Profile/Tabs/PhotosTab';
import SentFriendRequestsTab from './pages/Contacts/Tabs/SentFriendRequestsTab';
import PostPreview from './components/PostPreview';
import PostEditor from './pages/PostEditor';
import SettingDashboard from './pages/SettingDashboard';
import VerificationEmail from './pages/VerificationEmail';
import UpdateProfile from './pages/UpdateProfile';
import Messenger from './pages/Messenger';
import AboutTab from './pages/MyProfile/Tabs/AboutTab';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import PasswordManagement from './pages/SettingDashboard/Tabs/PasswordManagement';
import SearchUsersTab from './pages/Contacts/Tabs/SearchUsersTab/SearchUsersTab';
import EmailManagement from './pages/SettingDashboard/Tabs/EmailManagement';
import Cookies from 'universal-cookie';
import { useEffect } from 'react';

const cx = classNames.bind(styles);

const cookies = new Cookies();

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:user_id/:token" element={<ResetPassword />} />

      <Route path="/users/update-user-info/:user_id/:token" element={<UpdateProfile />}></Route>

      <Route path="/verification/:token" element={<VerificationEmail />}></Route>

      <Route
        path="messenger"
        element={
          <ProtectedRoutes>
            <Messenger />
          </ProtectedRoutes>
        }
      ></Route>

      <Route
        path="user/setting"
        element={
          <ProtectedRoutes>
            <SettingDashboard />
          </ProtectedRoutes>
        }
      ></Route>

      <Route
        path="user/setting/password"
        element={
          <ProtectedRoutes>
            <SettingDashboard>
              <PasswordManagement />
            </SettingDashboard>
          </ProtectedRoutes>
        }
      ></Route>

      <Route
        path="user/setting/email"
        element={
          <ProtectedRoutes>
            <SettingDashboard>
              <EmailManagement />
            </SettingDashboard>
          </ProtectedRoutes>
        }
      ></Route>

      <Route
        path="posts/post-preview/:post_id"
        element={
          <ProtectedRoutes>
            <PostPreview />
          </ProtectedRoutes>
        }
      ></Route>

      <Route
        path="posts/post-editor/:post_id"
        element={
          <ProtectedRoutes>
            <PostEditor />
          </ProtectedRoutes>
        }
      ></Route>

      <Route
        path="/messenger/:room_id"
        element={
          <ProtectedRoutes>
            <Messenger />
          </ProtectedRoutes>
        }
      />

      <Route
        path="/contacts/all-friends"
        element={
          <ProtectedRoutes>
            <Contacts>
              <AllFriendsTab />
            </Contacts>
          </ProtectedRoutes>
        }
      />

      <Route
        path="/contacts/suggestions"
        element={
          <ProtectedRoutes>
            <Contacts>
              <SuggestionsTab />
            </Contacts>
          </ProtectedRoutes>
        }
      />

      <Route
        path="/contacts/friend-requests"
        element={
          <ProtectedRoutes>
            <Contacts>
              <FriendRequestsTab />
            </Contacts>
          </ProtectedRoutes>
        }
      />

      <Route
        path="/contacts/sent-friend-requests"
        element={
          <ProtectedRoutes>
            <Contacts>
              <SentFriendRequestsTab />
            </Contacts>
          </ProtectedRoutes>
        }
      />

      <Route
        path="/contacts"
        element={
          <ProtectedRoutes>
            <Contacts></Contacts>
          </ProtectedRoutes>
        }
      />

      <Route
        path="/contacts/searching/:search_value"
        element={
          <ProtectedRoutes>
            <Contacts>
              <SearchUsersTab />
            </Contacts>
          </ProtectedRoutes>
        }
      />

      <Route
        path="/new-feeds"
        element={
          <ProtectedRoutes>
            <NewFeeds />
          </ProtectedRoutes>
        }
      />

      {/* CONTACT_PROFILE ROUTE */}
      <Route
        path="/profiles/:contact_id"
        element={
          <ProtectedRoutes>
            <ContactProfile>
              <ContactPostTab />
            </ContactProfile>
          </ProtectedRoutes>
        }
      />

      <Route
        path="/profiles/:contact_id/posts"
        element={
          <ProtectedRoutes>
            <ContactProfile>
              <ContactPostTab />
            </ContactProfile>
          </ProtectedRoutes>
        }
      />

      <Route
        path="/profiles/:contact_id/friends"
        element={
          <ProtectedRoutes>
            <ContactProfile>
              <ContactFriendsTab />
            </ContactProfile>
          </ProtectedRoutes>
        }
      />

      <Route
        path="/profiles/:contact_id/about"
        element={
          <ProtectedRoutes>
            <ContactProfile>
              <ContactAboutTab />
            </ContactProfile>
          </ProtectedRoutes>
        }
      />

      <Route
        path="/profiles/:contact_id/photos"
        element={
          <ProtectedRoutes>
            <ContactProfile>
              <ContactPhotosTab />
            </ContactProfile>
          </ProtectedRoutes>
        }
      />

      {/* MY_PROFILE ROUTE */}
      <Route
        path="/my-profile/posts"
        element={
          <ProtectedRoutes>
            <MyProfile>
              <MyPostsTab />
            </MyProfile>
          </ProtectedRoutes>
        }
      />

      <Route
        path="/my-profile/friends"
        element={
          <ProtectedRoutes>
            <MyProfile>
              <MyFriendsTab />
            </MyProfile>
          </ProtectedRoutes>
        }
      />

      <Route
        path="/my-profile/about"
        element={
          <ProtectedRoutes>
            <MyProfile>
              <AboutTab />
            </MyProfile>
          </ProtectedRoutes>
        }
      />

      <Route
        path="/my-profile/photos"
        element={
          <ProtectedRoutes>
            <MyProfile>
              <MyPhotosTab />
            </MyProfile>
          </ProtectedRoutes>
        }
      />

      <Route
        path="/change-profile"
        element={
          <ProtectedRoutes>
            <ProfileChanger />
          </ProtectedRoutes>
        }
      />
    </Routes>
  );
}

export default App;
