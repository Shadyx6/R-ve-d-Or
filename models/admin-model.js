const mongoose = require('mongoose');


const adminSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        minChar: 3,
       },
       email:String,
       password: String,
       products: {
        type: String,
        default: []
       },
       contact: Number,
       profilePicture: String,
       isAdmin: Boolean
})

module.exports = mongoose.model('admin', adminSchema)