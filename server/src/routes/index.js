// import errHandler from "../middlewares/errors";
import authRouter from "./auth";
import storyRouter from "./story";
import userRouter from "./user";

const initRoutes = (app) => {
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/story", storyRouter);
  app.use("/api/v1/user", userRouter);

  // it's for ErrorHandling
  // app.use(errHandler);
};

export default initRoutes;
