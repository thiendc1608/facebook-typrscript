import express from "express";

import cors from "cors";
import initRoutes from "./src/routes/index.js";
import connectDB from "./src/config/connectDB.js";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
initRoutes(app);
connectDB();
app.use("/", (req, res) => {
  res.send("Server is running");
});
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
