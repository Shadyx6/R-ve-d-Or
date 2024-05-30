const express = require('express')
const router = express.Router()
const isLoggedIn = require('../middlewares/auth')
const isSeller = require('../middlewares/isSeller')
const productsModel = require('../models/product-model')
const bcrypt = require('bcrypt')
const userModel = require('../models/user-model')
const jwt = require('jsonwebtoken')

router.get('/sellershub', isLoggedIn, (req,res) => {
    let error = req.flash('error')
    let sellerError = req.flash('sellerError')
    if(req.user === 'unsigned'){
        req.flash('sellerError', 'You must be logged in to become a seller ')
        return res.redirect('/access')    
    }
    else{
        res.render('sellersignup', {error, sellerError})
    }
})
router.post('/sellersign', async (req, res) => {
    let {email, password} = req.body
    let user = await userModel.findOne({email})
    if(!user) {
        req.flash('sellerError'), 'please enter correct details'
        return res.redirect('/sellershub')
    }
    if (user && user.isSeller === true) {
        req.flash('sellerError', 'You are already a seller')
        return res.redirect('/sellershub')
    }
    if (user && user.isSeller === false) {
        console.log('here')
    try {
        bcrypt.compare(password, user.password, async (err,result) => {
            if (err) {
                req.flash('sellerError', 'Please enter correct details')
                return res.redirect('/sellershub')
            }
            if(result) {
                let seller = await userModel.findOneAndUpdate({_id: user._id}, {isSeller: true})
                return res.redirect('/add')
            }
            
    })} catch (error) {
        req.flash('sellerError', 'something went wrong')
        return res.redirect('/sellershub')
    }
}
})

router.get('/add', isLoggedIn, isSeller, (req,res) => {
    let user = req.user
    res.render('addProducts', {user})
})

router.post('/push', async (req,res) => {
   let {title, images, description, price, category} = req.body
   if (!title || !images || !description || !price || !category) {
    res.send('please enter product details')
   }
   else{
    try {
        let product = await productsModel.create({
            title,
            images,
            description,
            price,
            category
        })
        res.send(product)
    } catch (error) {
        console.log(error.message)
    } 
   }
})

module.exports = router