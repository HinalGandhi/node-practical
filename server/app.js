const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean")
const hpp = require("hpp");

const app = express();

//1. Gloabl Middlewares
app.use(helmet())

//development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//limit requests from same API
const limiter = rateLimit({
  max:100,
  windowMs : 60 * 60 * 1000,
  message : "Too many requests from this IP, please try again in an hour!",
})

app.use('/api',limiter);

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const { whitelist } = require("validator");

//Body parser, reading data from body into req.body
app.use(express.json({limit: '10kb'}));

//Data sanitization against NoSQL query injection
app.use(mongoSanitize())

//Data sanitization against XSS
app.use(xss())

//Prevent parameter pollution
app.use(hpp({
  whitelist : ['duration','ratingsQuantity','ratingsAverage','maxGroupSize','difficulty','price']
}))

//Serving static files
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log("Hello from the middleware!");
  next();
});

//Test middleware
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

/* ------- --------- -------- */
app.all("*", (req, res, next) => {
  // res.status(404).json({
  //   status: "fail",
  //   message: `Can't find ${req.originalUrl} on this server!`,
  // });
  // next();

  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.status = "failed";
  // err.statusCode = 404;

  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
