import mongoose from "mongoose";

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log(`Connected to mLab `))
  .catch(() => console.error("could not connect to mLab"));

const conn = mongoose.connection;

export default conn;
