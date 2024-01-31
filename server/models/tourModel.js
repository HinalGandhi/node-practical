const mongoose = require("mongoose");
const slugify = require("slugify");
// const validator = require("validator");

const toursSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      trim: true,
      maxlength: [40, "A tour name must have less or equal then 40 characters"],
      minlength: [10, "A tour name must have more or equal then 10 characters"],
      //to use validator we can it's function like below
      // validate: [validator.isAlpha, "Tour name must only contain characters"],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
    },
    rating: {
      type: Number,
      required: [true, "A tour must have a rating"],
      default: 4.5,
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a group size"],
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty is either: easy, medium or difficult",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be a number above 1.0"],
      max: [5, "Rating must be a number below 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // (this) will point to new doc only when we create a new document
          return val < this.price;
        },
        message: "Discount Price {VALUE} should be below regular price",
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "A tour must have a description"],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a image cover"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTours: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

toursSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

//DOCUMENT MIDDLEWARE: runs before .save() and .create()
toursSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  console.log(this);
  next();
});

//QUERY MIDDLEWARE
// toursSchema.pre("find", function (next) {
toursSchema.pre(/^find/, function (next) {
  this.find({ secretTours: { $ne: true } });
  this.start = Date.now();
  next();
});

toursSchema.post(/^find/, function (doc, next) {
  console.log(`Query took ${Date.now() - this.start}ms`);
  console.log(doc);
  next();
});

//AGGREGATION MIDDLEWARE
toursSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { secretTours: { $ne: true } } });
  console.log(this.pipeline());
  next();
});

// toursSchema.post("save", function (doc, next) {
//   console.log(doc);
//   next();
// });

const Tour = mongoose.model("Tour", toursSchema);

module.exports = Tour;
