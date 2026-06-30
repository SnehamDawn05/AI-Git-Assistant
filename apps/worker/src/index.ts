import express from "express";

const app = express();

app.get("/", (_, res) => {
  res.send("Worker running...");
});

app.listen(5001, () => {
  console.log("Worker started at 5001");
});