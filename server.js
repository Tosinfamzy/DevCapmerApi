const express = require('express');
const dotenv = require('dotenv')
const morgan = require('morgan')

const bootcamp = require('./routes/bootcamp')
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error')

const app = express();

dotenv.config({path: './config/config.env'})
connectDB()
app.use(express.json())
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

app.use('/api/v1/bootcamps', bootcamp)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));