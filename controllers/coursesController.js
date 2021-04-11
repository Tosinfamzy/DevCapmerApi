const ErrorResponse = require("../utils/errorResponse");
const Courses = require("../models/Courses");
const Bootcamp = require("../models/bootcamp");

// @desc    Get all courses
// @route   GET /api/v1/courses
// @route   GET /api/v1/bootcamps/:bootcampId/courses
// @access  Public
exports.getCourses = async (req, res, next) => {
    let query;
    if (req.params.bootcampId) {
        query = Courses.find({bootcamp: req.params.bootcampId})
    } else {
        query = Courses.find().populate({
            path: 'bootcamp',
            select: 'name description'
        })
    }

    const courses = await query

    res.status(200).json({
        success: true,
        count: courses.length,
        data: courses,
      });
}

// @desc    Get single course
// @route   GET /api/v1/course/:courseId
// @access  Public
exports.getCourse = async (req, res, next) => {
    const course = await Courses.findById(req.params.id).populate({
        path: 'bootcamps',
        select: 'name description'
    })
    if (!course) {
        next(new ErrorResponse('Course does not exist', 404))
    }
    res.status(200).json({
        success: true,
        data: course,
      });
}

// @desc    Add course
// @route   POST /api/v1/bootcampId/:bootcampId/courses
// @access  Public
exports.addCourse = async (req, res, next) => {
    try {
        req.body.bootcamp = req.params.bootcampId
        const bootcamp = await Bootcamp.findById(req.params.bootcampId)
        if (!bootcamp) {
            next(new ErrorResponse('Bootcamp does not exist', 404))
        }
        const course = await Courses.create(req.body)
        res.status(200).json({
            success: true,
            data: course,
          });
    } catch (error) {
        next(error)
    }
   
}

// @desc    Update course
// @route   PUT /api/v1/courses/:id
// @access  Private
exports.updateCourse = async (req, res, next) => {
    try {
        let course = await Courses.findById(req.params.id)
        if (!course) {
            next(new ErrorResponse('Course does not exist', 404))
        }
        if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(
              new ErrorResponse(
                `User is not authorized to update course ${course._id}`,
                401
              )
            );
          }
        course = await Courses.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        res.status(200).json({
            success: true,
            data: course,
          });
    } catch (error) {
        next(error)
    }
   
}

// @desc    Delete course
// @route   DELETE /api/v1/courses/:id
// @access  Private
exports.deleteCourse = async (req, res, next) => {
    try {
        let course = await Courses.findById(req.params.id)
        if (!course) {
            next(new ErrorResponse('Course does not exist', 404))
        }
        if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(
              new ErrorResponse(
                `User is not authorized to delete course ${course._id}`,
                401
              )
            );
          }
        await course.remove()
        res.status(200).json({
            success: true,
            data: {},
          });
    } catch (error) {
        next(error)
    }
   
}