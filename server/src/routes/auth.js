var express = require('express');
var router = express.Router();
var { uploadUserAvatar } = require('../uploadFile/uploadFile');
const auth = require('../auth/auth');

const loginController = require('../app/controllers/LoginController');
const registerController = require('../app/controllers/RegisterController');
const tokenController = require('../app/controllers/TokenController');
const authController = require('../app/controllers/AuthController');

router.post('/login', loginController.access);
router.post('/logout', tokenController.disableRefreshToken);
router.post('/register', registerController.store);
router.post('/register/verification/:token', registerController.verifyToken);
router.post('/refresh-token', tokenController.getNewNewAccessToken);
router.post('/new-password', authController.setNewPassword);
router.post('/email/verifying', auth, authController.getTokenToVerifyEmail);
router.post('/email', auth, authController.changeEmail);
router.put('/password', auth, authController.changePassword);
router.get('/password-reset-token/:user_name', authController.getPasswordResetToken);
module.exports = router;
