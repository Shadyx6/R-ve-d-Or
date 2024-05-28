const jwt = require('jsonwebtoken');
function isLoggedIn(req, res, next) {
    let token = req.cookies.token
    if (!token) {
        return next()
    }
    try {
        jwt.verify(token, process.env.TOKEN, (err, data) => {
            if (err) console.log(err)
            req.user = data
            next()
        })
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = isLoggedIn