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

const {protect, authorize} = require('../middleware/auth')
router.use('/:bootcampId/courses', courseRouter)
router.route("/radius/:postcode/:distance").get(getBootCampByRadius);

router.route("/").get(getBootCamps).post(protect,authorize('publisher', 'admin'), createBootCamp);

router
  .route("/:id")
  .get(getBootCamp)
  .put(protect,authorize('publisher', 'admin'), updateBootCamp)
  .delete(protect,authorize('publisher', 'admin'), deleteBootCamp);

module.exports = router;
