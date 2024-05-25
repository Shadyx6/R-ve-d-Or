const mongoose = require('mongoose');
const debug = require('debug')('development:mongoose');

mongoose.connect('mongodb://localhost:27017/reve')
.then(() => {
    debug('connected to MongoDB Successfully')
})
.catch((err) => {
    debug(err)
})

let db =  mongoose.connection 

module.exports = db