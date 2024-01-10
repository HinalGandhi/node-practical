const fs = require("fs");

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/tours-simple.json`)
);

//param middleware
exports.checkId = (req, res, next, val) => {
  const id = req.params.id * 1;

  if (id > tours.length) {
    return res.status(404).json({
      status: "failed",
      message: "Invalid Id",
    });
  }

  next();
};

//body middleware
exports.checkBody = (req, res, next) => {
  const name = req.body.name;
  const pricing = req.body.price;

  if (!name || !pricing) {
    return res.status(400).json({
      status: "fail",
      message: "Missing name or price",
    });
  }
  next();
};

//Route handlers
exports.getAllTours = (req, res) => {
  console.log("req.requestTime", req.requestTime);

  res
    .status(200)
    .json({ status: "success", results: tours.length, data: { tours } });
};

exports.getTour = (req, res) => {
  const id = req.params.id * 1;

  //1st solution - simplistic
  // if (id > tours.length) {
  //   return res.status(404).json({
  //     status: "failed",
  //     message: "Invalid Id",
  //   });
  // }

  const tour = tours.find((e) => id === e.id);

  //2nd solution based on tour
  // if (!tour) {
  //   return res.status(404).json({
  //     status: "failed",
  //     message: "Invalid Id",
  //   });
  // }

  res.status(200).json({ status: "success", data: { tour } });
};

exports.createTour = (req, res) => {
  console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({ status: "success", data: { tour: newTour } });
    }
  );
};

exports.updateTour = (req, res) => {
  res
    .status(200)
    .json({ message: "success", data: { tour: "Tour updated successfully" } });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({ message: "success", data: null });
};
