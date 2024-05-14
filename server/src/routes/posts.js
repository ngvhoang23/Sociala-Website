var express = require('express');
var router = express.Router();

const auth = require('../auth/auth');
const PostController = require('../app/controllers/PostController');
const { uploadPostFiles, uploadCommentMedia } = require('../uploadFile/uploadFile');

router.get('/sharing', auth, PostController.getSharingPost);
router.get('/photos/:user_id', auth, PostController.getPhotos);
router.get('/your-posts', auth, PostController.getYourPosts);
router.get('/invidual-posts/:profile_id', auth, PostController.getInvidualPosts);
router.get('/:post_id', auth, PostController.getPost);
router.get('/reactions/:post_id', auth, PostController.getReactionsOfPost);
router.get('/reaction-types/:post_id', auth, PostController.getReactionByType);
router.get('/user-commentings/:post_id', auth, PostController.getUserCommentings);
router.get('/', auth, PostController.getPosts);
router.post('/', auth, uploadPostFiles.array('upload-files', 100), PostController.postPost);
router.post('/sharing', auth, PostController.sharePost);
router.post('/reactions/:post_id', auth, PostController.insertReaction);
router.get('/comments/:post_id', auth, PostController.getCommentOfPost);
router.post('/comments/:post_id', auth, uploadCommentMedia.single('uploading-media'), PostController.postComment);
router.put('/:post_id', auth, uploadPostFiles.array('upload-files', 100), PostController.editPost);
router.put('/comments/:comment_id', auth, uploadCommentMedia.single('uploading-media'), PostController.editComment);
router.delete('/:post_id', auth, PostController.deletePost);
router.delete('/reactions/:post_id', auth, PostController.unReact);
router.delete('/comments/:comment_id', auth, PostController.deleteComment);

module.exports = router;
