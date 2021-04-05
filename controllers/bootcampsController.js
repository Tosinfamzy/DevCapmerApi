const ErrorResponse = require("../utils/errorResponse");
const Bootcamp = require("../models/bootcamp");
const geocoder = require("../utils/geocoder");
// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootCamps = async (req, res, next) => {
  try {
    let query;
    const reqQuery = { ...req.query };
    const removeFields = ["select", "sort", "page", "limit"];

    removeFields.forEach((field) => delete reqQuery[field]);

    let queryStr = JSON.stringify(reqQuery);

    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/,
      (match) => `$${match}`
    );
    query = Bootcamp.find(JSON.parse(queryStr)).populate('courses');

    if (req.query.select) {
      const fields = req.query.select.split(",").join(" ");
      query = query.select(fields);
    }

    if (req.query.sort) {
      const sortby = req.query.sort.split(",").join(" ");
      query = query.sort(sortby);
    } else {
      query = query.sort("-createdAt");
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Bootcamp.countDocuments();

    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }
    query = query.skip(startIndex).limit(limit);

    const bootcamps = await query;
    res.status(200).json({
      success: true,
      count: bootcamps.length,
      pagination,
      data: bootcamps,
    });
  } catch (error) {
    console.log(error);
    next(new ErrorResponse(`Bootcampp not found`, 404));
  }
};

// @desc    Get single bootcamps
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootCamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
      res
        .status(404)
        .json({ success: false, data: `${req.params.id} not found ` });
    }
    res.status(200).json({ success: true, data: bootcamp });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private
exports.createBootCamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({ success: true, data: bootcamp });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error,
    });
  }
};

// @desc    Update bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootCamp = async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!bootcamp) {
    next(error);
  }
  res.status(200).json({ success: true, data: bootcamp });
};

// @desc    Delete bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootCamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndRemove(req.params.id);
    if (!bootcamp) {
      next(error);
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Bootcamp by Radius
// @route   GET /api/v1/bootcamps/radius/:postcode/:distance
// @access  Private
exports.getBootCampByRadius = async (req, res, next) => {
  try {
    const { postcode, distance } = req.params;
    const loc = await geocoder.geocode(postcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    const radius = distance / 3963; //Radius of earth is 3963

    const bootcamps = await Bootcamp.find({
      location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
    });

    res.status(200).json({
      success: true,
      count: bootcamps.length,
      data: bootcamps,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload photo
// @route   PUT /api/v1/bootcamps/:id/photo
// @access  Private
exports.bootcampPhotoUpload = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
      next(error);
    }
    if (!req.files) {
      return next(new ErrorResponse(`Please upload a file`, 400))
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};