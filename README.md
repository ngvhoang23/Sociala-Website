# Introduction
![web_bg](https://github.com/ngvhoang23/Sociala-Website/assets/110328041/86eec070-8235-4907-9606-39975f433301)

## :ledger: Index

- [About](#beginner-about)
- [File Structure](#file_folder-file-structure)
- [Technology](#-technology-to-build-application)
- [Gallery](#camera-gallery)

##  :beginner: About
#### Sociala is your all-in-one platform for seamless communication and community building. 
<h3>Key Features:</h3>
<h5>Real-Time Messaging </h5>
<h6>Enjoy fast and reliable messaging with real-time updates, ensuring your conversations are always current and engaging.</h6>

<h5>Dynamic Posting:</h5> <h6>Share your thoughts, photos, videos, and links with your network. Like, comment, and engage with posts to stay connected and informed </p6>

<h5>Group Chatting:</h5> <h6>Create and manage group chats effortlessly. Perfect for team projects, social clubs, or any group activity, our group chat feature supports robust discussions and easy collaboration.</h6>

<h5>User Profiles:</h6> <h6>Customize your profile to reflect your personality. Add photos, update your bio, and let your connections know more about you.</h6>

<h5>Notifications:</h5> <h6>Stay informed with real-time notifications for new messages, group updates, and interactions on your posts.</h6>

<h5>Media Sharing:</h5> <h6>Easily share images, videos, and other files within your chats and posts, enhancing your conversations with multimedia content.</h6>

<h5>Privacy and Security:</h5> <h6>Your privacy is our priority. ConnectHub uses advanced encryption and secure protocols to protect your data and ensure your conversations remain private.</h6>

<h5>Accessibility:</h5> <h6>Our platform is designed to be accessible to all users, with features that ensure an inclusive experience for everyone.</h6>


## 🚀 Technology to Build Application

Here are the main technologies used to build this application:

- **Programming Languages:**
  - ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) **JavaScript** - The language of the web, used for frontend and backend development.

- **Frameworks and Libraries:**
  - ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) **React** - A JavaScript library for building user interfaces.
  - ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white) **Node.js** - A JavaScript runtime built on Chrome's V8 JavaScript engine.
  - ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white) **Express.js** - Fast, unopinionated, minimalist web framework for Node.js.
  - ![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socket.io&logoColor=white) **Socket.IO** - Real-time bidirectional event-based communication library for web applications.

- **Database:**
  - ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white) **MySQL** - An open-source relational database management system.

- **Version Control:**
  - ![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white) **Git** - A distributed version-control system for tracking changes in source code.

### Additional Tools:
- **IDE:** ![VS Code](https://img.shields.io/badge/VS%20Code-007ACC?style=for-the-badge&logo=visual-studio-code&logoColor=white) **Visual Studio Code** - A free source-code editor made by Microsoft for Windows, Linux, and macOS.


##  :file_folder: File Structure
```
client
   ├── src
   |    ├── assets 
   |    ├── AuthComponent
   |    │    └── ProtectedRoutes.js
   |    ├── components
   |    │    ├── ContactItem
   |    │    │     ├── ContactItem.js
   |    │    │     ├── ContactItem.module.scss
   |    │    └── ...
   |    │         ├── ...
   |    │         ├── ...
   |    │         └── ...  
   |    ├── MainLayout
   |    │    ├── MainLayout.js
   |    │    ├── MainLayout.module.scss
   |    │    ├── components
   |    |         ├── MainNavigation
   |    |               ├── MainNavigation.js
   |    |               └── MainNavigation.module.scss
   |    |     
   |    ├── pages
   |    │    ├── Login
   |    |    │    ├── Login.js
   |    |    │    └── Login.module.scss
   |    |    ├── ...
   |    |         ├── ...
   |    |         └── ...
   |    ├── App.js
   |    └── index.js
   |       
server
   ├── src
        ├── app
        │   └── controllers
        |         ├── AuthControllers.js
        |         ├── UserController.js
        |         └── ...
        ├── auth
        |    └── auth.js
        ├── routes
        |    ├── users.js
        |    ├── posts.js
        |    └── ...
        ├── socketIO
        |    └── socketIO.js
        └── index.js

```

### Client
| No | File Name | Details 
|----|------------|-------|
| 1  | /assets | This folder contains static assets such as images, fonts, and other media files.
| 2  | /ProtectedRoutes.js | This file contains a component that manages protected routes, ensuring that only authenticated users can access certain parts of the application.
| 3  | /MainLayout | The main layout that wraps around other components, providing a consistent layout
| 4  | /MainLayout/MainLayout.js | The main layout component that wraps around other components, providing a consistent layout.
| 5  | /MainLayoutMainLayout\components | This folder contains components for MainLayout
| 6  | /pages | This folder contains pages for website
| 7  | /App.js | The root component that sets up routing and other top-level components.
| 8  | /index.js | The entry point for the React application, responsible for rendering the App component into the DOM.
| 9  | *.module.scss | The SCSS module for styling component.

### Server
| No | File Name | Details 
|----|------------|-------|
| 1  | /app/controllers | Controllers handling requests and responses for various features of your social network application
| 1  | /auth/auth.js | Responsible for checking token and authorization
| 2  | /routes | Defines the API endpoints for application
| 3  | /socketIO/socketIO.js | Sets up Socket.IO for real-time communication between the server and clients.
| 4  | index.js | The main entry point for the server application, responsible for initializing the server


##  :camera: Gallery
### :arrow_right: Profile
![profile](https://github.com/ngvhoang23/Sociala-Website/assets/110328041/81055808-ffa3-4984-9fd7-c71a99195a2a)

### :arrow_right: Messenger
![messenger](https://github.com/ngvhoang23/Sociala-Website/assets/110328041/83369573-29f9-4730-96c6-8f16c989df56)

### :arrow_right: Sign In
![signin](https://github.com/ngvhoang23/Sociala-Website/assets/110328041/828df860-7754-4942-b321-0cc770e5e431)

### :arrow_right: Sign Up
![sign-up](https://github.com/ngvhoang23/Sociala-Website/assets/110328041/cf8f076d-ed9a-4464-9cd7-f823a1bbce29)

### :arrow_right: Story
![story-preview](https://github.com/ngvhoang23/Sociala-Website/assets/110328041/d2c2df73-01b1-49d1-bbd6-2a3e13cc4945)

### :arrow_right: Post Detail
![post-single-detail](https://github.com/ngvhoang23/Sociala-Website/assets/110328041/1948797c-1c08-413c-a61b-0bcd2d9947fc)

### :arrow_right: Post Detail
![post-detail](https://github.com/ngvhoang23/Sociala-Website/assets/110328041/258bfe35-01ca-41f1-a6c0-e1aaa78cdc14)


##  :lock: License
