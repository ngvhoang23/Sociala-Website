const multer = require('multer');
const path = require('path');
const { isImage, isVideo } = require('../UserDefinedFunctions');

let count = 0;

const storageUserAvatar = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, './src/public/user-avatars/');
  },
  filename: (req, file, callBack) => {
    callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const uploadUserAvatar = multer({
  storage: storageUserAvatar,
});

const storageRoomAvatar = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, './src/public/room-avatars/');
  },
  filename: (req, file, callBack) => {
    callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const uploadRoomAvatar = multer({
  storage: storageRoomAvatar,
});

const storageFiles = multer.diskStorage({
  destination: (req, file, callBack) => {
    if (isVideo(file.originalname)) {
      callBack(null, './src/public/videos/');
    } else if (isImage(file.originalname)) {
      callBack(null, './src/public/images/');
    } else {
      callBack(null, './src/public/documents/');
    }
  },
  filename: (req, file, callBack) => {
    const fileIds = req.body.fileIds;
    file.id = typeof fileIds == 'string' ? fileIds : fileIds[fileIds.length - 1];
    file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
    callBack(null, file.id + '-' + file.originalname);
  },
});

const uploadFiles = multer({
  storage: storageFiles,
  onError: function (err, next) {
    console.log('error', err);
    next(err);
  },
});

const storagePostFiles = multer.diskStorage({
  destination: (req, file, callBack) => {
    if (isVideo(file.originalname)) {
      callBack(null, './src/public/videos/');
    } else if (isImage(file.originalname)) {
      callBack(null, './src/public/images/');
    } else {
      callBack(null, './src/public/documents/');
    }
  },
  filename: (req, file, callBack) => {
    file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
    callBack(null, ++count + Date.now() + '-' + file.originalname);
  },
});

const uploadPostFiles = multer({
  storage: storagePostFiles,
  onError: function (err, next) {
    console.log('error', err);
    next(err);
  },
});

const storageCommentMedia = multer.diskStorage({
  destination: (req, file, callBack) => {
    if (isVideo(file.originalname)) {
      callBack(null, './src/public/videos/');
    } else if (isImage(file.originalname)) {
      callBack(null, './src/public/images/');
    }
  },
  filename: (req, file, callBack) => {
    file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
    callBack(null, ++count + Date.now() + '-' + file.originalname);
  },
});

const uploadCommentMedia = multer({
  storage: storageCommentMedia,
  onError: function (err, next) {
    console.log('error', err);
    next(err);
  },
});

const storageStoryMedia = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, './src/public/stories/');
  },
  filename: (req, file, callBack) => {
    file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8').replace(/\s/g, '');
    callBack(null, ++count + Date.now() + '-' + file.originalname.replace(/\s/g, ''));
  },
});

const uploadStoryMedia = multer({
  storage: storageStoryMedia,
  onError: function (err, next) {
    console.log('error', err);
    next(err);
  },
});

module.exports = {
  uploadUserAvatar,
  uploadRoomAvatar,
  uploadFiles,
  uploadPostFiles,
  uploadCommentMedia,
  uploadStoryMedia,
};
