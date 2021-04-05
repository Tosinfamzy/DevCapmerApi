const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  title: {
      type:String,
      trim: true,
      required: [true, 'Please add a course title']
  },
  description: {
      type: String,
      required: [true, 'Please add a description']
  },
  weeks: {
    type: String,
    required: [true, 'Please add number of weeks']
  },
  tuition: {
    type: Number,
    required: [true, 'Please add Tuition']
  },
  minimumSkill: {
    type: String,
    required: [true, 'Please add minimum skill'],
    enum: ['beginner', 'intermediate', 'advanced']
  },
  scholarhipsAvailable: {
    type: Boolean,
    default:false
  },
  createdAt: {
      type: Date,
      default: Date.now
  }, 
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: true
}, 
});
CourseSchema.statics.getAverageCost = async function (bootcampId) {
  const costObj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId }
    },
    {
      $group: {
        _id: '$bootcamp',
        averageCost: { $avg: '$tuition'}
      }
    }
  ])

  try {
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId,{
      averageCost: costObj[0].averageCost
    })
  } catch (error) {
    console.error(error);
  }

}
CourseSchema.post('save', function () {
  this.constructor.getAverageCost(this.bootcamp)
});

CourseSchema.pre('remove', function () {
  this.constructor.getAverageCost(this.bootcamp)
});

module.exports = mongoose.model('Course', CourseSchema)
