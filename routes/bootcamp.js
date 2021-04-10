const express = require("express");
const {
  getBootCamps,
  getBootCamp,
  createBootCamp,
  updateBootCamp,
  deleteBootCamp,
  getBootCampByRadius,
} = require("../controllers/bootcampsController");
// Route resources
const courseRouter = require('./courses')


const router = express.Router();

const {protect} = require('../middleware/auth')
router.use('/:bootcampId/courses', courseRouter)
router.route("/radius/:postcode/:distance").get(getBootCampByRadius);

router.route("/").get(getBootCamps).post(protect, createBootCamp);

router
  .route("/:id")
  .get(getBootCamp)
  .put(protect, updateBootCamp)
  .delete(protect, deleteBootCamp);

module.exports = router;
