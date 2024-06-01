const mongoose = require('mongoose');

const userModel = mongoose.Schema({
   fullName: {
    type: String,
    required: true,
    minChar: 3,
   },
   email:{
      type: String,
      required: true
   },
   username: {
      type: String,
      required: true,
      unique: true,
   },
   password: {
      type: String,
      required: true
   },
   cart: {
    type: Array,
    default: []
   },
   contact: Number,
   picture: String,
   isSeller: {
      type: Boolean,
      default: false
   },
   products: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'product'
   }]
}, {timestamps: true})

module.exports = mongoose.model('user', userModel)