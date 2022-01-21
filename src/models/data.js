const mongoose = require('mongoose');

// Create Data Schema
const dataSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    required:true,
        ref:'User'
  },
},
{
    timestamps: {
      currentTime: () =>
        Math.floor(new Date().setHours(new Date().getHours() + 2)),
    },
  });


const Data = mongoose.model('Data', dataSchema);
module.exports = Data;
