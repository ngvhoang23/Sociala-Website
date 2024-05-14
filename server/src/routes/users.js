var express = require('express');
var router = express.Router();

const auth = require('../auth/auth');
const UserController = require('../app/controllers/UserController');
const { uploadUserAvatar } = require('../uploadFile/uploadFile');
const FriendController = require('../app/controllers/FriendController');

router.get('/suggested-users', auth, UserController.getSuggestedUsers);
router.get('/search-users', auth, UserController.getSearchedUsers);
// when search_value is empty
router.get('/user-info', auth, UserController.getUserInfo);
router.get('/friends/relationship/:user_id', auth, FriendController.getRelationship);
router.get('/search-users', auth, UserController.getSearchedUsers);
router.get('/friends/friend-requests/:user_id', auth, FriendController.getFriendRequest);
router.get('/friends/sent-friend-requests/:user_id', auth, FriendController.getSentFriendRequest);
router.get('/mutual-friends/:user_id', auth, FriendController.getMutualFriends);
router.get('/friends/:user_id', auth, FriendController.searchFriends);
router.get('/friends', auth, FriendController.getFriends);
router.get('/:slug', auth, UserController.getContactProfile);

router.put('/friend-req', auth, FriendController.responseFriendReq);
router.put('/user-info/contact-and-basic-info/:user_id', auth, UserController.updateUserContactAndBasicInfo);
router.put(
  '/user-info/:user_id',
  auth,
  uploadUserAvatar.fields([
    { name: 'user_avatar', maxCount: 1 },
    { name: 'background_image', maxCount: 1 },
  ]),
  UserController.changeUserInfo,
);

router.delete('/friend-req', auth, FriendController.removeFriendReq);
router.delete('/friends/:friendId', auth, FriendController.unFriend);
router.delete('/user-info/contact-and-basic-info/:user_id', auth, UserController.deleteUserContactAndBasicInfo);

router.post('/friend-req', auth, FriendController.postFriendReq);
router.post('/update-user/:id', auth, uploadUserAvatar.single('avatar'), UserController.changeUserInfo);
router.post('/user-info', auth, UserController.insertUserInfo);
module.exports = router;
