const mongoose = require('mongoose')

const postModel = mongoose.Schema({
    image: String,
    name: String,
    price: Number,
    discount: String,
    bgColor: String,
    panelColor: String,
    textColor: String
})