const express = require('express');
const router = express.Router();
const userModel = require('../models/user-model');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const debug = require('debug')('development:routes')
const isLoggedIn = require('../middlewares/auth')
const productModel = require('../models/product-model')
router.get('/', isLoggedIn, async function (req, res) {
    let feat = await productModel.find({category: 'men shirt'})
    console.log(feat)
   if (req.user) {
    res.render('index', {user: req.user, feat})
   } else {
    res.render('index', {user: 'null', feat})
   }
})
router.get('/access', function (req, res) {
    res.render('access')
})

router.post('/register', async (req, res) => {
    let { fullName, email, username, password } = req.body;
    let user = await userModel.findOne({ username })
    if (user) res.send('user already exists')
    try {
        if (!process.env.TOKEN) res.send('You do not have a token ')
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, async (err, hash) => {
                try {
                    let user = await userModel.create({
                        fullName,
                        email,
                        username,
                        password: hash
                    })
                    let token = jwt.sign({ username, userId: user._id }, process.env.TOKEN)
                    res.cookie('token', token)
                    res.render('index', {user})
                } catch (error) {
                    console.log(error)
                }
            })
        })
    } catch (error) {
        console.log(error)
    }

})

router.post('/login', async (req, res) => {
    let { email, password } = req.body
    let user = await userModel.findOne({ email })
    if (!user) console.log("register first")
    try {
        bcrypt.compare(password, user.password, (err, result) => {
            if (!result) res.send('something went wrong')
            if (result) {
                let token = jwt.sign({ username: user.username, userId: user._id }, process.env.TOKEN)
                res.cookie('token', token)
                res.render('index', {user})
            }
        })
    } catch (error) {
        console.log(error.message)
    }
})

router.get('/logout', (req, res) => {
    res.clearCookie('token')
    req.user = null
    res.redirect('/')
})
module.exports = router;