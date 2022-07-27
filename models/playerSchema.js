const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const playerSchema = new Schema({

  hasSubmittedCurrRound: {
   type: Boolean,
    required: true
  },
  hasPassedCurrRound:{
    type: Boolean,
    required: true
  },
  isEliminated:{
    type:Boolean,
    required: true
  },
  pictureURL:{
    type:String
  },
  email:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true
  },
  name:{
    type:String,
    required:true
  }
  
  


  
}, {timestamps: true});

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;