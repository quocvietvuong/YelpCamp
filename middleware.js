const { campgroundSchema, reviewSchema } = require('./schemas')
const ExpressError = require('./utils/ExpressError')
const Campground = require('./models/campground')
const Review = require('./models/review')

const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl
    req.flash('error', 'You must be signed in first!')
    return res.redirect('/login')
  }
  next()
}

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body)
  if (error) {
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next()
  }
}

const storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo
  }
  next()
}

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body)
  if (error) {
      const msg = error.details.map(el => el.message).join(',')
      throw new ExpressError(msg, 400)
  } else {
      next()
  }
}

const isAuthor = async(req, res, next) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    console.log('entered isAuthor middleware, author: ', campground.author, ' req.user._id: ', req.user._id)
    if(!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

const isReviewAuthor = async(req, res, next) => {
  const { id, reviewId } = req.params
  const review = await Review.findById(reviewId)
  console.log('entered isReviewAuthor middleware, author: ', review.author, ' req.user._id: ', req.user._id)
  if(!review.author.equals(req.user._id)) {
      req.flash('error', 'You do not have permission to do that!')
      return res.redirect(`/campgrounds/${id}`)
  }
  next()
}

module.exports = { isLoggedIn, storeReturnTo, validateCampground, isAuthor, validateReview, isReviewAuthor }