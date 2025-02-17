const Campground = require('../models/campground')

const index = async (req, res) => {
  const campgrounds = await Campground.find({});
  return res.render('campgrounds/index', { campgrounds })
}

const renderNewForm = (req, res) => {
  res.render('campgrounds/new')
}

const createCampground = async (req,res, next) => {
    const campground = new Campground(req.body.campground)
    campground.author = req.user._id
    await campground.save()
    req.flash('success', 'Successfully made a new campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}

const showCampground = async (req, res) => {
  const campground = await Campground.findById(req.params.id)
    .populate({
      path: 'reviews',
      populate: {
          path: 'author'
      }
    }).populate('author')
  if (!campground) {
      req.flash('error', 'Cannot find that campground!')
      return res.redirect('/campgrounds')
  }
  console.log('Campground details: ', campground)
  res.render('campgrounds/show', { campground })
}

const renderEditForm = async (req, res) => {
  const campground = await Campground.findById(req.params.id)
  if (!campground) {
      req.flash('error', 'Cannot find that campground!')
      return res.redirect('/campgrounds')
  }
  console.log('found campground: ', campground)
  res.render('campgrounds/edit', { campground })
}

const editCampground = async (req, res, next) => {
  try {
      const { id } = req.params;
      const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
      req.flash('success', 'Successfully updated campground')
      res.redirect(`/campgrounds/${campground._id}`)
  } catch (err) {
      next(err)
  }
}

const deleteCampground = async (req, res) => {
  const { id } = req.params
  await Campground.findByIdAndDelete(id)
  req.flash('success', 'Successfully deleted campground')
  res.redirect('/campgrounds')
}

module.exports = { 
  index,
  renderNewForm,
  createCampground,
  showCampground,
  renderEditForm,
  editCampground,
  deleteCampground
}