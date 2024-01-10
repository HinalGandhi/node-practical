const express = require("express");

const tourController = require("./../controllers/tourController");
const {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  checkId,
  checkBody,
} = tourController;
const router = express.Router();

//param middleware
router.param("id", checkId);

router.route("/").get(getAllTours).post(checkBody, createTour);
router.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
