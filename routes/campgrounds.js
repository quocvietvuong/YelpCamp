const express = require('express')
const router = express.Router()
const campgrounds = require('../controllers/campgrounds')
const catchAsync = require('../utils/catchAsync')
const { validateCampground, isLoggedIn, isAuthor } = require('../middleware')

router.route('/')
      .get(catchAsync(campgrounds.index))
      .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground))

router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.route('/:id')
      .get(catchAsync(campgrounds.showCampground))
      .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.editCampground))
      .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))

module.exports = router