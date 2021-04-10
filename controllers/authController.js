const crypto = require('crypto');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');


// @desc      Register user
// @route     POST /api/v1/auth/register
// @access    Public

exports.register = async(req, res, next)=>{
    try {
        const { name, email, password, role } = req.body;

        // Create user
        const user = await User.create({
          name,
          email,
          password,
          role,
        });
        sendTokenResponse(user, 200, res)

    } catch (error) {
        next(error)
    }

}

// @desc      Login user
// @route     POST /api/v1/auth/login
// @access    Public

exports.login = async(req, res, next)=>{
    try {
        const { email, password } = req.body;

        if(!email || !password){
            next(new ErrorResponse(`Please Provide and email and password`, 400))
        }

        const user = await User.findOne({email:email}).select('+password')

        if (!user) {
            next(new ErrorResponse(`User not found`, 401))
        }
        const isMatch = await user.matchPassword(password)
        if (!isMatch) {
            next(new ErrorResponse(`User not found`, 401))
        }
        sendTokenResponse(user, 200, res)
    } catch (error) {
        next(error)
    }

}

const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken()
    const options ={
        expires:new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    res.status(statusCode).cookie('token', token, options).json({
        success:true,
        token
    })
}


