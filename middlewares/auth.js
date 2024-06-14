const jwt = require('jsonwebtoken');
const flash = require('connect-flash')
function isLoggedIn(req, res, next) {
    if(req.cookies.token) {
        if(process.env.TOKEN){
            try {
                jwt.verify(req.cookies.token, process.env.TOKEN, (err, data) => {
                    if (err) console.log(err)
                    req.user = data
                    next()
                })
            } catch (error) {
                console.log(error.message)
            }
        }
    } else{
        req.user = 'unsigned'
        next()
    }
}
function isLoggedInStrict(req, res, next) {
    if(req.cookies.token) {
        if(process.env.TOKEN){
            try {
                jwt.verify(req.cookies.token, process.env.TOKEN, (err, data) => {
                    if (err) console.log(err)
                    req.user = data
                    next()
                })
            } catch (error) {
                console.log(error.message)
            }
        }
    } else{
        req.user = 'unsigned'
        req.flash('sellerError', 'you are not authorized')
        res.redirect('/access')
    }
}
module.exports.isLoggedIn = isLoggedIn
module.exports.isLoggedInStrict = isLoggedInStrict