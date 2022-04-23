import "dotenv/config";
import express from "express";
import session from "express-session";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import mongodbSession from "connect-mongodb-session";

import rootRouter from "./routes/index";

import "./db";

const MongoDBStore = mongodbSession(session);

const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: "sessions",
  expires: 1000 * 60 * 5, // 5mins
});

const app = express();
const port = 3000;

store.on("error", function (error) {
  console.log(`express session error: ${error}`);
});

app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// set up cookie
app.use(cookieParser());
// set up session
app.use(
  session({
    name: "sessionToken",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store,
  })
);

app.use("/api/v1", rootRouter);

app.listen(port, () => {
  return console.log(`express is listending at port: ${port}`);
});
