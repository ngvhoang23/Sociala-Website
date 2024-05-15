var express = require("express");
var router = express.Router();

const auth = require("../auth/auth");
const { uploadFiles } = require("../uploadFile/uploadFile");
const MessageDataController = require("../app/controllers/MessageDataController");

// [GET METHOD]
router.get("/chat-boxes", auth, MessageDataController.getChatBoxes);
router.get("/", auth, MessageDataController.index);
router.get("/check-exist", auth, MessageDataController.checkExistChat);
router.get("/contacts", auth, MessageDataController.getContacts);
router.get("/more-messages/:slug", auth, MessageDataController.getMoreMessages);
router.get("/:slug", auth, MessageDataController.getChatHistory);
router.get("/media/:room_id", auth, MessageDataController.getMedia);
router.get("/documents/:roomId", auth, MessageDataController.getDocuments);

// [POST METHOD]
router.post("/", auth, uploadFiles.array("upload-files", 100), MessageDataController.postMessages);
router.post("/notification", auth, MessageDataController.postNotification);

// [UPDATE METHOD]
router.post("/update-last-seen-message", auth, MessageDataController.updateLastSeenMessage);

// [UPDATE METHOD]
router.post("/remove/:messageId", MessageDataController.removeMessage);

module.exports = router;
