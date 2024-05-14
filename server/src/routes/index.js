const authRouter = require("./auth");
const messageDatasRouter = require("./messageDatas");
const roomsRouter = require("./rooms");
const usersRouter = require("./users");
const notificationsRouter = require("./notifications");
const postsRouter = require("./posts");
const storiesRouter = require("./stories");

function route(app) {
  app.use("/auth", authRouter);
  app.use("/message-datas", messageDatasRouter);
  app.use("/rooms", roomsRouter);
  app.use("/users", usersRouter);
  app.use("/notifications", notificationsRouter);
  app.use("/posts", postsRouter);
  app.use("/stories", storiesRouter);
}

module.exports = route;
