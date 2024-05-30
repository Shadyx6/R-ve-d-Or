const jwt = require('jsonwebtoken');
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

module.exports = isLoggedIn