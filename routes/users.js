const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const users = require('../controllers/users')
const User = require('../models/user')
const passport = require('passport')
const { storeReturnTo } = require('../middleware')

router.get('/register', users.renderRegistrationForm)

router.post('/register', catchAsync(users.registerUser))

router.get('/login', users.renderLogin)

router.post('/login',
  storeReturnTo,
  passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
  users.login)

router.get('/logout', users.logout)

module.exports = router