const ErrorResponse = require('../utils/errorResponse')
const Bootcamp = require('../models/bootcamp')
// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootCamps = async(req, res, next) => {
    try {
        const bootcamps = await Bootcamp.find()
        res.status(200).json({success: true, count:bootcamps.length ,data: bootcamps})
    } catch (error) {
        next(new ErrorResponse(`Bootcampp not found`, 404))
    }

}

// @desc    Get single bootcamps
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootCamp = async(req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id)
        if (!bootcamp) {
            res.status(404).json({success:false, data:`${req.params.id} not found `});
        }
        res.status(200).json({success: true, data: bootcamp})
    } catch (error) {
        next(error)
    }
}

// @desc    Create new bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private
exports.createBootCamp = async(req, res, next) => {
    try {
        const bootcamp = await Bootcamp.create(req.body)
        res.status(201).json({success: true, data: bootcamp})
    } catch (error) {
        res.status(400).json({
            success:false,
            error:error
        })
    }

}

// @desc    Update bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootCamp = async(req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body,{
        new: true,
        runValidators: true
    })
    if (!bootcamp) {
        next(error)
    }
    res.status(200).json({success: true, data: bootcamp})
}

// @desc    Delete bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootCamp = async(req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
        if (!bootcamp) {
            next(error)
        }
        res.status(200).json({success: true, data: {}})
    } catch (error) {
        next(error)
    }

}