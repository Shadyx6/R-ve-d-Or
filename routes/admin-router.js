const express = require('express')
const router = express.Router()
const isLoggedIn = require('../middlewares/auth')
const productsModel = require('../models/product-model')

router.get('/add', isLoggedIn, (req,res) => {
    res.render('addProducts', {user: req.user})
})

router.post('/push', async (req,res) => {
   let {title, images, description, price, category} = req.body
   if (!title || !images || !description || !price || !category) {
    res.send('please enter product details')
    console.log(req.body)
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