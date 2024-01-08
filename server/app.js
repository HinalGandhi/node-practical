const express = require("express");
const fs = require("fs");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res
    .status(200)
    .json({ message: "Hello from the server side!", app: "Demo app" });
});

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/tours-simple.json`)
);

app.get("/api/v1/tours", (req, res) => {
  res
    .status(200)
    .json({ status: "success", results: tours.length, data: { tours } });
});

app.post("/api/v1/tours", (req, res) => {
  console.log(req.body);
  res.send("Done!");
});

const port = 4000;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
