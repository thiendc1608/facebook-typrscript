// import errHandler from "../middlewares/errors";
import authRouter from "./auth";
import storyRouter from "./story";
import userRouter from "./user";
import conversationRouter from "./conversation";
import emojiRouter from "./emoji";
import postRouter from "./post";
import commentRouter from "./comment";

const initRoutes = (app) => {
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/story", storyRouter);
  app.use("/api/v1/user", userRouter);
  app.use("/api/v1/conversation", conversationRouter);
  app.use("/api/v1/emoji", emojiRouter);
  app.use("/api/v1/post", postRouter);
  app.use("/api/v1/comment", commentRouter);

  // it's for ErrorHandling
  // app.use(errHandler);
};

export default initRoutes;
