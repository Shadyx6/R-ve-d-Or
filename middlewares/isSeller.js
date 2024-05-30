function isSeller(req,res,next) {
    if(req.user === 'unsigned'){
        req.flash('sellerError', 'You must be logged in to become a seller ')
        res.redirect('/access')    
    }
    else{
        next()
    }
}
module.exports = isSeller