const crypto = require('crypto');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');


// @desc      Register user
// @route     POST /api/v1/auth/register
// @access    Public

exports.register = (req, res, next)=>{
    const { name, email, password, role } = req.body;

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    const token = user.getSignedJwtToken()

    res.status(200).json({success: true, token: token})
}
