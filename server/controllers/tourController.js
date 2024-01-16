// const fs = require("fs");
const Tour = require("../models/tourModel");

//param middleware
// exports.checkId = (req, res, next, val) => {
//   console.log(`Checking the ${val}`);
//   const id = req.params.id * 1;

//   if (id > tours.length) {
//     return res.status(404).json({
//       status: "failed",
//       message: "Invalid Id",
//     });
//   }

//   next();
// };

//body middleware
// exports.checkBody = (req, res, next) => {
//   const name = req.body.name;
//   const pricing = req.body.price;

//   if (!name || !pricing) {
//     return res.status(400).json({
//       status: "fail",
//       message: "Missing name or price",
//     });
//   }
//   next();
// };

//Route handlers
exports.getAllTours = async (req, res) => {
  // BUILD QUERY
  // 1) Filtering
  const queryObj = { ...req.query };
  const excludedFields = ["page", "sort", "limit", "fields"];
  excludedFields.forEach((el) => delete queryObj[el]);

  // 2) Advanced filtering
  const queryStr = JSON.stringify(queryObj);
  const filterQuery = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => {
    console.log(`$${match}`);
    return `$${match}`;
  });

  let query = Tour.find(JSON.parse(filterQuery));

  //3) Sorting
  if (req.query.sort) {
    const sortQuery = req.query.sort.split(",").join(" ");
    query = query.sort(sortQuery);
  } else {
    query = query.sort("-createdAt");
  }

  //4) Field Limiting
  if (req.query.fields) {
    let fields = req.query.fields.split(",").join(" ");
    query = query.select(fields);
  } else {
    query = query.select("-__v"); // exclude the __v from the query
  }

  console.log(JSON.parse(filterQuery));
  // { difficulty: 'easy', duration: { $gte: 5 }}
  // { difficulty: 'easy', duration: {gte: '5' } }
  // EXECUTE QUERY

  try {
    const tours = await query;
    res
      .status(200)
      .json({ status: "success", results: tours.length, data: { tours } });
  } catch (error) {
    res.status(404).json({ status: "failed", message: error });
  }
};

exports.getTour = async (req, res) => {
  //fs method
  // const id = req.params.id * 1;

  //1st solution - simplistic
  // if (id > tours.length) {
  //   return res.status(404).json({
  //     status: "failed",
  //     message: "Invalid Id",
  //   });
  // }
  // const tour = tours.find((e) => id === e.id);

  //2nd solution based on tour
  // if (!tour) {
  //   return res.status(404).json({
  //     status: "failed",
  //     message: "Invalid Id",
  //   });
  // }
  try {
    const tour = await Tour.findById(req.params.id);
    console.log(req.params.id);
    res.status(200).json({ status: "success", data: { tour } });
  } catch (error) {
    res.status(404).json({ status: "failed", message: error });
  }
};

exports.createTour = async (req, res) => {
  //fs method
  // const newId = tours[tours.length - 1].id + 1;
  // const newTour = Object.assign({ id: newId }, req.body);
  // tours.push(newTour);
  // fs.writeFile(
  //   `${__dirname}/dev-data/tours-simple.json`,
  //   JSON.stringify(tours),
  //   (err) => {
  // res.status(201).json({ status: "success", data: { tour: newTour } });
  // }
  // );

  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({ status: "success", data: { tour: newTour } });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: "Invalid data sent!",
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findOneAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ status: "success", data: { tour } });
  } catch (error) {
    res.status(404).json({ status: "failed", message: error });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findOneAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      message: "Tour deleted successfully!",
    });
  } catch (error) {
    res.status(404).json({ status: "failed", message: error });
  }
};
