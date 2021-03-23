const express = require('express');
const dotenv = require('dotenv')
const bootcamp = require('./routes/bootcamp')
const connectDB = require('./config/db');
const morgan = require('morgan')

const app = express();

dotenv.config({path: './config/config.env'})
connectDB()
app.use(express.json())
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

app.use('/api/v1/bootcamps', bootcamp)

const PORT = process.env.PORT || 5000
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));