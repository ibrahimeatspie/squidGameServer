const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roundSchema = new Schema({

  date: {
   type: [Number],
    required: true
  },
  roundDescription:{
    type: String,
    required: true
  },
  
  


  
}, {timestamps: true});

const Round = mongoose.model('Round', roundSchema);

module.exports = Round;