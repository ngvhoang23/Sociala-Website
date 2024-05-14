var express = require("express");
var router = express.Router();

const auth = require("../auth/auth");
const NotificationController = require("../app/controllers/NotificationController");

router.get("/:userId", auth, NotificationController.getNotifications);

router.put("/:user_id/:target_user_id/:defined_noti_id", auth, NotificationController.updateIsRead);

router.post("/single-noti", auth, NotificationController.postNotification);
router.post("/multiple-noti", auth, NotificationController.postNotifications);

router.delete("/:user_id1/:user_id2", auth, NotificationController.deleteNotifications);
router.delete("/:user_id/:target_user_id/:defined_noti_id", auth, NotificationController.deleteNotification);

module.exports = router;
