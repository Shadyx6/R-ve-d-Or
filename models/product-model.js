const mongoose = require('mongoose')

const prodModel = mongoose.Schema({
    images: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    size:{
        type: String
    },
    discount: String,
    bgColor: String,
    panelColor: String,
    textColor: String,
    color: {
        type: String,
    },
    category: {
        type: Array,
        required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'seller'
    }
})

module.exports = mongoose.model('products', prodModel)