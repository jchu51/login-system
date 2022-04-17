import express from "express";
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("HI");
});

app.listen(port, () => {
  return console.log(`express is listending at port: ${port}`);
});
