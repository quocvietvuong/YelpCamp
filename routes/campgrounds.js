const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const Campground = require('../models/campground');
const campgroundSchema = require('../schemas')

router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    console.log('Campground List: ', campgrounds)
    res.render('campgrounds/index', { campgrounds })
}))

router.get('/new', (req, res) => {
    res.render('campgrounds/new')
})

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body)
  if (error) {
      const msg = error.details.map(el => el.message).join(',')
      throw new ExpressError(msg, 400)
  } else {
      next()
  }
}

router.post('/', validateCampground, catchAsync(async (req,res, next) => {
    console.log('req.body: ', req.body)
    const campground = new Campground(req.body.campground)
    console.log('campground model object: ', campground)
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews')
    console.log('Campground details: ', campground)
    res.render('campgrounds/show', { campground })
}))

router.get('/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    console.log('found campground: ', campground)
    res.render('campgrounds/edit', { campground })
}))

router.put('/:id', catchAsync(async (req, res, next) => {
    try {
        const { id } = req.params;
        const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
        res.redirect(`/campgrounds/${campground._id}`)
    } catch (err) {
        next(err)
    }
}))

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
}))

module.exports = router