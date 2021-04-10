const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return next(new ErrorResponse("Not Authorised", 401));
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = User.findById(decided.id);
      next();
    } catch (error) {
      return next(new ErrorResponse("Not Authorised", 401));
    }
  } catch (error) {
    next(error);
  }
};
