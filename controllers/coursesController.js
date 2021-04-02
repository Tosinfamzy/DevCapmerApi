const ErrorResponse = require("../utils/errorResponse");
const Courses = require("../models/Courses");

// @desc    Get all courses
// @route   GET /api/v1/courses
// @route   GET /api/v1/bootcamps/:bootcampId/courses
// @access  Public
exports.getCourses = async (req, res, next) => {
    let query;
    if (req.params.bootcampId) {
        query = Courses.find({bootcamp: req.params.bootcampId})
    } else {
        query = Courses.find()
    }

    const courses = await query

    res.status(200).json({
        success: true,
        count: courses.length,
        data: courses,
      });
}