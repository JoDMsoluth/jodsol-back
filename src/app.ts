import express from "express";
const app: express.Application = express();
import helmet from "helmet";
import cors from "cors";

import session from "express-session";
import cookieParser from "cookie-parser";
import errorHandler from "errorhandler";

import mongo from "connect-mongo";
import mongoose from "mongoose";

import path from "path";
import dotenv from "dotenv";
dotenv.config();

import router from "routes";
import initializeViews from "lib/initializeViews";
// import createDummyData from "lib/createDummyData";

// connect to mongodb
const MongoStore: mongo.MongoStoreFactory = mongo(session);
export const mongoUrl: string = process.env.MONGO_DB || "mongodb://127.0.0.1/";
(<any>mongoose).Promise = global.Promise; // use Node Promise. because promise not exist in mongodb

mongoose
  .connect(mongoUrl, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log("  MongoDB is connected successfully.");
    // createDummyData();
  })
  .catch(err => {
    console.log(
      `MongoDB connection error. Please make sure MongoDB is running. : ${err.message}`
    );
    process.exit();
  });

// setting express

app.use(
  cors({
    origin: true,
    credentials: true,
    exposedHeaders: ["Authorization", "Last-Page"] // i can use res.headers
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cookieParser(String(process.env.COOKIE_SECRET)));
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: String(process.env.COOKIE_SECRET),
    cookie: {
      httpOnly: true,
      secure: false //https를 쓸 때 true
    },
    store: new MongoStore({
      url: mongoUrl,
      autoReconnect: true
    }),
    name: "bck"
  })
);

if (process.env.NODE_ENV === "development") {
  app.use(errorHandler());
}
app.use("/", express.static(path.join(__dirname, "public")));
app.use("/", express.static("uploads")); // 다른서버에서 정적파일 가져갈 수 있도록 함, 앞의 주소는 프론트에서 접근하는 주소

app.use("/", router);
initializeViews();

export default app;
