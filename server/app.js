const express = require("express");
const morgan = require("morgan");

const app = express();

//1. Middlewares
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log("Hello from the middleware!");
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// app.get("/api/v1/tours", getAllTours);
// app.get("/api/v1/tours/:id", getTour);
// app.post("/api/v1/tours", createTour);
// app.patch("/api/v1/tours/:id", updateTour);
// app.delete("/api/v1/tours/:id", deleteTour);

//2. Routes
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

//
app.all("*", (req, res, next) => {
  // res.status(404).json({
  //   status: "fail",
  //   message: `Can't find ${req.originalUrl} on this server!`,
  // });
  // next();

  const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  err.status = "failed";
  err.statusCode = 404;

  next(err);
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "failed";

  res.status(err.statusCode).json({ status: err.status, message: err.message });
});

module.exports = app;
