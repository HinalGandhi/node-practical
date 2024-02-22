// const fs = require("fs");
const Tour = require("../models/tourModel");
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

//middle ware to create a alias tour path
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,summary,ratingsAverage,difficulty";
  next();
};

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
exports.getAllTours = catchAsync(async (req, res) => {
  // BUILD QUERY
  // EXECUTE QUERY
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginated();
  const tours = await features.query;

  //Send Response
  res
    .status(200)
    .json({ status: "success", results: tours.length, data: { tours } });

  //for reference only
  // try {
  //   // 1) Filtering
  //   // const queryObj = { ...req.query };
  //   // const excludedFields = ["page", "sort", "limit", "fields"];
  //   // excludedFields.forEach((el) => delete queryObj[el]);

  //   // 2) Advanced filtering
  //   // const queryStr = JSON.stringify(queryObj);
  //   // const filterQuery = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => {
  //   //   console.log(`$${match}`);
  //   //   return `$${match}`;
  //   // });

  //   // let query = Tour.find(JSON.parse(filterQuery));

  //   //3) Sorting
  //   // if (req.query.sort) {
  //   //   const sortQuery = req.query.sort.split(",").join(" ");
  //   //   query = query.sort(sortQuery);
  //   // } else {
  //   //   query = query.sort("-createdAt");
  //   // }

  //   //4) Field Limiting
  //   // if (req.query.fields) {
  //   //   let fields = req.query.fields.split(",").join(" ");
  //   //   query = query.select(fields);
  //   // } else {
  //   //   query = query.select("-__v"); // exclude the __v from the query
  //   // }

  //   //5) Pagination
  //   // const page = req.query.page * 1 || 1;
  //   // const limit = req.query.limit * 1 || 100;
  //   // const skip = (page - 1) * limit; // to skip the records and get the requested page results

  //   // query = query.skip(skip).limit(limit);

  //   // if (req.query.page) {
  //   //   const numTours = await Tour.countDocuments();
  //   //   if (skip >= numTours) throw new Error("This page does not exist");
  //   // }
  //   // console.log(JSON.parse(filterQuery));
  //   // { difficulty: 'easy', duration: { $gte: 5 }}
  //   // { difficulty: 'easy', duration: {gte: '5' } }

  //   // EXECUTE QUERY
  //   const features = new APIFeatures(Tour.find(), req.query)
  //     .filter()
  //     .sort()
  //     .limitFields()
  //     .paginated();
  //   const tours = await features.query;

  //   //Send Response
  //   res
  //     .status(200)
  //     .json({ status: "success", results: tours.length, data: { tours } });
  // } catch (error) {
  //   res.status(404).json({ status: "failed", message: error });
  // }
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);

  if (!tour) {
    return next(new AppError("No tour found with this ID", 404));
  }

  res.status(200).json({ status: "success", data: { tour } });

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

  /* 
  try {
    const tour = await Tour.findById(req.params.id);
    console.log(req.params.id);
    res.status(200).json({ status: "success", data: { tour } });
  } catch (error) {
    res.status(404).json({ status: "failed", message: error });
  }
  */
});

exports.createTour = catchAsync(async (req, res) => {
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

  // try {
  //   const newTour = await Tour.create(req.body);
  //   res.status(201).json({ status: "success", data: { tour: newTour } });
  // } catch (error) {
  //   res.status(400).json({
  //     status: "failed",
  //     message: error.message,
  //   });
  // }

  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      tour: newTour,
    },
  });
});

exports.updateTour = catchAsync(async (req, res) => {
  const tour = await Tour.findOneAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    return next(new AppError("No tour found with this ID", 404));
  }

  res.status(200).json({ status: "success", data: { tour } });

  /* 
 try {
    const tour = await Tour.findOneAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ status: "success", data: { tour } });
  } catch (error) {
    res.status(404).json({ status: "failed", message: error });
  }
  */
});

exports.deleteTour = catchAsync(async (req, res) => {
  const tour = await Tour.findOneAndDelete(req.params.id);

  if (!tour) {
    return next(new AppError("No tour found with this ID", 404));
  }

  res.status(204).json({
    status: "success",
    message: "Tour deleted successfully!",
  });

  // try {
  // await Tour.findOneAndDelete(req.params.id);
  // res.status(204).json({
  //   status: "success",
  //   message: "Tour deleted successfully!",
  // });
  // } catch (error) {
  //   res.status(404).json({ status: "failed", message: error });
  // }
});

exports.getTourStats = catchAsync(async (req, res) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        // _id: "$ratingsAverage",
        _id: { $toUpper: "$difficulty" },
        numTours: { $sum: 1 },
        numRatings: {
          $sum: "$ratingsQuantity",
        },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    //we can have two same comparators as well
    // {
    //   $match: { _id: { $ne: "EASY" } },
    // },
  ]);

  res.status(200).json({ status: "success", data: { stats } });

  // try {
  //   const stats = await Tour.aggregate([
  //     {
  //       $match: { ratingsAverage: { $gte: 4.5 } },
  //     },
  //     {
  //       $group: {
  //         // _id: "$ratingsAverage",
  //         _id: { $toUpper: "$difficulty" },
  //         numTours: { $sum: 1 },
  //         numRatings: {
  //           $sum: "$ratingsQuantity",
  //         },
  //         avgRating: { $avg: "$ratingsAverage" },
  //         avgPrice: { $avg: "$price" },
  //         minPrice: { $min: "$price" },
  //         maxPrice: { $max: "$price" },
  //       },
  //     },
  //     {
  //       $sort: { avgPrice: 1 },
  //     },
  //     //we can have two same comparators as well
  //     // {
  //     //   $match: { _id: { $ne: "EASY" } },
  //     // },
  //   ]);
  //   console.log(stats);
  //   res.status(200).json({ status: "success", data: { stats } });
  // } catch (error) {
  //   res.status(404).json({ status: "failed", message: error });
  // }
});

exports.getMonthlyPlan = catchAsync(async (req, res) => {
  const year = req.params.year * 1;

  const plan = await Tour.aggregate([
    {
      $unwind: "$startDates",
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        numTours: { $sum: 1 },
        tours: { $push: "$name" },
      },
    },
    {
      $addFields: { month: "$_id" },
    },
    {
      $project: { _id: 0 },
    },
    {
      $sort: {
        numTourStarts: -1,
      },
    },
    {
      $limit: 12,
    },
  ]);
  res
    .status(200)
    .json({ status: "success", results: plan.length, data: { plan } });

  // try {
  //   const year = req.params.year * 1;

  //   const plan = await Tour.aggregate([
  //     {
  //       $unwind: "$startDates",
  //     },
  //     {
  //       $match: {
  //         startDates: {
  //           $gte: new Date(`${year}-01-01`),
  //           $lte: new Date(`${year}-12-31`),
  //         },
  //       },
  //     },
  //     {
  //       $group: {
  //         _id: { $month: "$startDates" },
  //         numTours: { $sum: 1 },
  //         tours: { $push: "$name" },
  //       },
  //     },
  //     {
  //       $addFields: { month: "$_id" },
  //     },
  //     {
  //       $project: { _id: 0 },
  //     },
  //     {
  //       $sort: {
  //         numTourStarts: -1,
  //       },
  //     },
  //     {
  //       $limit: 12,
  //     },
  //   ]);
  //   res
  //     .status(200)
  //     .json({ status: "success", results: plan.length, data: { plan } });
  // } catch (error) {
  //   res.status(404).json({ status: "failed", message: error });
  // }
});
