const express = require("express");

const tourController = require("./../controllers/tourController");
const {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  aliasTopTours,
} = tourController;
const router = express.Router();

//param middleware
// router.param("id", checkId);
router.route("/").get(getAllTours).post(createTour);
router.route("/top-5-cheap").get(aliasTopTours, getAllTours);
router.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
