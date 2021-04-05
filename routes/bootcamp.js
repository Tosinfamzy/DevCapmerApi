const express = require("express");
const {
  getBootCamps,
  getBootCamp,
  createBootCamp,
  updateBootCamp,
  deleteBootCamp,
  getBootCampByRadius,
  bootcampPhotoUpload
} = require("../controllers/bootcampsController");
// Route resources
const courseRouter = require('./courses')


const router = express.Router();
router.use('/:bootcampId/courses', courseRouter)
router.route("/radius/:postcode/:distance").get(getBootCampByRadius);
router.route("/:id/photo").put(bootcampPhotoUpload)

router.route("/").get(getBootCamps).post(createBootCamp);

router
  .route("/:id")
  .get(getBootCamp)
  .put(updateBootCamp)
  .delete(deleteBootCamp);

module.exports = router;
