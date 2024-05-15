import { useContext, useEffect } from 'react';
import { UserInfoContext } from '~/AuthComponent/ProtectedRoutes';
import { IsOpenRoomInfoProvider } from '~/pages/Messenger/Contexts/IsOpenRoomInfo';
import { ChatBarProvider } from '~/Context/ChatBarContext';
import { ChatBoxesProvider } from '~/Context/ChatBoxesContext';
import { CheckingLayerProvider } from '~/Context/CheckingLayerContext';
import { ContactsProvider } from '~/Context/ContactsContext';
import { CurrentMediaPreviewProvider } from '~/Context/CurrentMediaPreviewContext';
import { CurrentRoomProvider } from '~/Context/CurrentRoomContext';
import { DocumentsProvider } from '~/Context/DocumentsContext';
import { IsMessengerProvider } from '~/Context/IsMessengerContext';
import { IsOpenAddingGroupChatMembersBoxProvider } from '~/Context/IsOpenAddingGroupChatMembersBoxContext';
import {
  IsOpenEditingGroupChatBoxContext,
  IsOpenEditingGroupChatBoxProvider,
} from '~/Context/IsOpenEditingGroupChatBoxContext';
import { IsOpenGroupChatGeneratorProvider } from '~/Context/IsOpenGroupChatGeneratorContext';
import { IsOpenNotificationProvider } from '~/Context/IsOpenNotificationContext';
import { IsOpenPostGeneratorProvider } from '~/Context/IsOpenPostGeneratorContext';
import { IsOpenRoomInfoBarProvider } from '~/Context/IsOpenRoomInfoBarContext';
import { IsOpenStoryGeneratorProvider } from '~/Context/IsOpenStoryGeneratorContext';
import { MediaProvider } from '~/Context/MediaContext';
import { MediaPreviewProvider } from '~/Context/MediaPreviewContext';
import { MessagesProvider } from '~/Context/MessagesContext';
import { NewMessageProvider } from '~/Context/NewMessageContext';
import { NotificationsProvider } from '~/Context/NotificationsContext';
import { OnlineUsersProvider } from '~/Context/OnlineUsersContext';
import { RoomIdsProvider } from '~/Context/RoomIdsContext';
import { RoomStateProvider } from '~/Context/RoomStateContext';
import { StoryPreviewProvider } from '~/Context/StoryPreviewContext';
import { StrangeMessageProvider } from '~/Context/StrangeMessageContext';
import Cookies from 'universal-cookie';
import { AxiosInstanceContext } from '../AxiosInterceptorWrapper/AxiosInterceptorWrapper';
import { IsOpenChangePasswordModalProvider } from '~/Context/IsOpenChangePasswordModalContext';
import { RoomCustomizingProvider } from '~/Context/RoomCustomizingContext';
import { IsLoadingProvider } from '~/Context/IsLoadingContext';
import { NeedToReLoadProvider } from '~/Context/NeedToReLoadContext';
import { CurrentMutualFriendsModalProvider } from '~/Context/CurrentMutualFriendsModalContext';
import { CurrentReactionsModalProvider } from '~/Context/CurrentReactionsModalContext';
import { RoomAddingMembersProvider } from '~/Context/RoomAddingMembersContext';
import { IsOpenEditProfileModalProvider } from '~/Context/IsOpenEditProfileModalContext';
import { IsOpenChangeEmailModalProvider } from '~/Context/IsOpenChangeEmailModalContext';

const cookies = new Cookies();

function ContextWrapper({ children }) {
  const userInfoContext = useContext(UserInfoContext);
  const user = userInfoContext.user;

  const axiosInstanceContext = useContext(AxiosInstanceContext);
  const axiosInstance = axiosInstanceContext;

  return (
    <DocumentsProvider>
      <MediaProvider>
        <CurrentRoomProvider>
          <MessagesProvider>
            <ChatBarProvider>
              <OnlineUsersProvider>
                <IsOpenRoomInfoBarProvider>
                  <RoomStateProvider>
                    <StrangeMessageProvider>
                      <NewMessageProvider>
                        <NotificationsProvider>
                          <ContactsProvider>
                            <IsOpenNotificationProvider>
                              <ChatBoxesProvider>
                                <IsMessengerProvider>
                                  <RoomIdsProvider>
                                    <CurrentMediaPreviewProvider>
                                      <IsOpenPostGeneratorProvider>
                                        <StoryPreviewProvider>
                                          <IsOpenStoryGeneratorProvider>
                                            <CheckingLayerProvider>
                                              <MediaPreviewProvider>
                                                <IsOpenGroupChatGeneratorProvider>
                                                  <IsOpenAddingGroupChatMembersBoxProvider>
                                                    <IsOpenEditingGroupChatBoxProvider>
                                                      <IsOpenRoomInfoProvider>
                                                        <IsOpenChangePasswordModalProvider>
                                                          <RoomCustomizingProvider>
                                                            <IsLoadingProvider>
                                                              <NeedToReLoadProvider>
                                                                <CurrentMutualFriendsModalProvider>
                                                                  <CurrentReactionsModalProvider>
                                                                    <RoomAddingMembersProvider>
                                                                      <IsOpenEditProfileModalProvider>
                                                                        <IsOpenChangeEmailModalProvider>
                                                                          <div>{children}</div>
                                                                        </IsOpenChangeEmailModalProvider>
                                                                      </IsOpenEditProfileModalProvider>
                                                                    </RoomAddingMembersProvider>
                                                                  </CurrentReactionsModalProvider>
                                                                </CurrentMutualFriendsModalProvider>
                                                              </NeedToReLoadProvider>
                                                            </IsLoadingProvider>
                                                          </RoomCustomizingProvider>
                                                        </IsOpenChangePasswordModalProvider>
                                                      </IsOpenRoomInfoProvider>
                                                    </IsOpenEditingGroupChatBoxProvider>
                                                  </IsOpenAddingGroupChatMembersBoxProvider>
                                                </IsOpenGroupChatGeneratorProvider>
                                              </MediaPreviewProvider>
                                            </CheckingLayerProvider>
                                          </IsOpenStoryGeneratorProvider>
                                        </StoryPreviewProvider>
                                      </IsOpenPostGeneratorProvider>
                                    </CurrentMediaPreviewProvider>
                                  </RoomIdsProvider>
                                </IsMessengerProvider>
                              </ChatBoxesProvider>
                            </IsOpenNotificationProvider>
                          </ContactsProvider>
                        </NotificationsProvider>
                      </NewMessageProvider>
                    </StrangeMessageProvider>
                  </RoomStateProvider>
                </IsOpenRoomInfoBarProvider>
              </OnlineUsersProvider>
            </ChatBarProvider>
          </MessagesProvider>
        </CurrentRoomProvider>
      </MediaProvider>
    </DocumentsProvider>
  );
}

export default ContextWrapper;
