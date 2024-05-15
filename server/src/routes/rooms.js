var express = require("express");
var router = express.Router();

const auth = require("../auth/auth");
const { route } = require("./auth");
const { uploadRoomAvatar } = require("../uploadFile/uploadFile");
const RoomController = require("../app/controllers/RoomController");

router.post("/create-new-room", auth, uploadRoomAvatar.single("roomAvatar"), RoomController.createRoom);
router.post("/delete/:roomId", auth, RoomController.deleteChat);
router.post("/remove-user", auth, RoomController.removeUser);
router.post("/set-admin/:userId", auth, RoomController.setAdmin);
router.post("/add-users/", auth, RoomController.addUsers);
router.post("/leave-room", auth, RoomController.leaveRoom);
router.post("/change-info", auth, uploadRoomAvatar.single("roomAvatar"), RoomController.changeInfo);

router.get("/:slug", auth, RoomController.getRoomInfo);
router.get("/get-users-in-room/:roomId", auth, RoomController.getUsersOfRoom);

module.exports = router;
