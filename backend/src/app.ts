import bodyParser from "body-parser";
import express from "express";

const app = express();
app.use(bodyParser.json());

// CORS
app.use((_, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT, DELETE, POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

const port = 3456;
app.listen(port, () => {
  console.log("Server is running on http://localhost:" + port);
});
