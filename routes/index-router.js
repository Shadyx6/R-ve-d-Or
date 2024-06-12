const express = require('express');
const router = express.Router();
const userModel = require('../models/user-model');
const productsModel = require('../models/product-model');

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const debug = require('debug')('development:routes')
const isLoggedIn = require('../middlewares/auth')
const productModel = require('../models/product-model')
require('dotenv').config()


router.get('/', isLoggedIn, async function (req, res) {
    let error = req.flash('error')
    let feat = await productModel.find({ tags: 'featured' })
    let trendy = await productModel.find({ tags: 'trend' })
    res.render('index', { user: req.user, feat, error, trendy })

})
router.get('/access', function (req, res) {
    let registerError = req.flash('registerError')
    let loginError = req.flash('loginError')
    let sellerError = req.flash('sellerError')
    res.render('access', { registerError, loginError, sellerError })
})

router.post('/register', async (req, res) => {
    let { fullName, email, username, password } = req.body;
    let user = await userModel.findOne({ username })
    if (user) {
        req.flash('registerError', 'User already exists')
        return res.redirect('/access')
    }
    try {
        if (!process.env.TOKEN) {
            req.flash('registerError', 'Token missing')
            return res.send('bring token')
        }
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, async (err, hash) => {
                try {
                    let user = await userModel.create({
                        fullName,
                        email,
                        username,
                        password: hash
                    })
                    let token = jwt.sign({ username, userId: user._id, isSeller: user.isSeller }, process.env.TOKEN)
                    res.cookie('token', token)
                    res.redirect('/')
                } catch (error) {
                    req.flash('registerError', 'cannot create user')
                    console.log(error)
                    res.redirect('/access')
                }
            })
        })
    } catch (error) {
        req.flash('registerError', 'something went wrong')
        res.redirect('/access')
    }

})

router.post('/login', async (req, res) => {
    let { email, password } = req.body
    let user = await userModel.findOne({ email })
    if (!user) {
        req.flash('loginError', 'please register first')
        return res.redirect('/access')
    }

    try {
        if (!process.env.TOKEN) {
            req.flash('registerError', 'Token missing')
            return res.send('bring token')
        }
        bcrypt.compare(password, user.password, (err, result) => {
            if (!result) {
                req.flash('loginError', 'something went wrong')
                return res.redirect('/access')
            }
            if (result) {
                let token = jwt.sign({ username: user.username, userId: user._id, isSeller: user.isSeller }, process.env.TOKEN)
                res.cookie('token', token)
                res.redirect('/')
            }
        })
    } catch (error) {
        req.flash('loginError', 'something went wrong')
        res.redirect('/access')
    }
})

router.get('/logout', (req, res) => {
    res.clearCookie('token')
    req.user = 'unsigned'
    res.redirect('/')
})
router.get('/products', (req, res) => {
    res.render('product', { user: 'unsigned' })
})

router.get('/products/:id', isLoggedIn, async (req, res) => {
    let product = await productsModel.findOne({ _id: req.params.id })
    res.render('product', { product: product, user: req.user })
})
router.get('/clothings/:category', isLoggedIn, async (req, res) => {
    let category = req.params.category.toLowerCase();
    displayCategory = category.charAt(0).toUpperCase() + category.slice(1);
        let selectedProducts = await productsModel.find({ category: req.params.category, isApproved: true })
        if(req.query.gender === 'all'){
            return res.render('categorized', { user: req.user, selectedProducts, displayCategory, category, cat: true, gen: false })
        } if(req.query.gender === 'men'){
           let selectedProducts = await productsModel.find({ category: req.params.category, isApproved: true, gender: 'men' })
           return res.render('categorized', { user: req.user, selectedProducts, displayCategory, category, cat: true, gen: false })
        } if(req.query.gender === 'women'){
            let selectedProducts = await productsModel.find({ category: req.params.category, isApproved: true, gender: 'women' })
            return res.render('categorized', { user: req.user, selectedProducts, displayCategory, category, cat: true, gen: false })
        } else{
            return res.render('categorized', { user: req.user, selectedProducts, displayCategory, category, cat: true, gen: false })
        }
       
})

router.get('/fits/:gender', isLoggedIn, async (req, res) => {
    let selectedProducts = await productsModel.find({ gender: req.params.gender, isApproved: true })
    let gender = req.params.gender;
    gender = gender.charAt(0).toUpperCase() + gender.slice(1);
    res.render('categorized', { user: req.user, selectedProducts, gender, gen: true, cat: false })
})

router.get('/login', (req, res) => {
    let loginError = req.flash('loginError')
    res.render('login', { loginError })
})
router.post('/add-to-cart/:id', isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({ username: req.user.username })
    let product = await productsModel.findOne({ _id: req.params.id })
    user.cart.push({ productId: product._id })
    try {
        await user.save()
        res.json({ message: 'products added successfully', user })
    } catch (error) {
        console.log(error)
    }

})

router.get('/cart', isLoggedIn, async (req, res) => {
    let error = req.flash('error')
    let user = await userModel.findOne({ username: req.user.username }).populate({ path: 'cart.productId' })
    try {
        res.render('cart', { user: req.user, cart: user.cart, error })
    } catch (error) {
        console.log(error)
    }

})
router.get('/remove-from-cart/:id', isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({ username: req.user.username })
    await user.updateOne({ $pull: { cart: { productId: req.params.id } } })
    try {
        res.redirect('/cart')
    } catch (error) {
        console.log(error)
    }
})
router.get('/sub-quantity/:id', isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({ username: req.user.username })
    let product = user.cart.find(product => product._id == req.params.id)
    if(product && product.quantity > 1) {
        product.quantity -= 1
    } else{
        product.quantity = 1
        req.flash('error', 'You must have at least one product to purchase')
        return res.redirect('/cart')
    }
    try {
        await user.save()
        res.redirect('/cart')
    } catch (error) {
        console.log(error)
    }

})
router.get('/add-quantity/:id', isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({ username: req.user.username })
    let product = user.cart.find(product => product._id == req.params.id)
    if(product && product.quantity < 100) {
        product.quantity += 1
    } else{
        product.quantity = 100
        req.flash('error', 'cannot order more than 100 products')
        return res.redirect('/cart')
    }
    try {
        await user.save()
        res.redirect('/cart')
    } catch (error) {
        console.log(error)
    }

})
module.exports = router;