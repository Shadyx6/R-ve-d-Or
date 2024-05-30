const express = require('express')
const router = express.Router()
const isLoggedIn = require('../middlewares/auth')
const isSeller = require('../middlewares/isSeller')
const productsModel = require('../models/product-model')
const bcrypt = require('bcrypt')
const userModel = require('../models/user-model')
const jwt = require('jsonwebtoken')

router.get('/sellershub', isLoggedIn, isSeller, (req,res) => {
    let error = req.flash('error')
    res.render('sellersignup', {user: req.user, error})
})
router.post('sellersign', async (req, res) => {
    let {email, password} = req.body
    let seller = await userModel.findOne({email})
    if (seller) res.send('seller already exists')
    

})
router.get('/add', isLoggedIn, (req,res) => {
    let user = req.user
    console.log(user)
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