const express = require('express')
const mongoose = require('mongoose')
const { campgroundSchema, reviewSchema } = require('./schemas')
const path = require('path');
const ejsMate = require('ejs-mate') // just one of many engine
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')
const methodOverride = require('method-override')
const Campground = require('./models/campground');
const Review = require('./models/review')

const campgroundsRouter = require('./routes/campgrounds')

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const db = mongoose.connection
db.on("error", console.error.bind(console,"connection error:"))
db.once("open", () => {
    console.log("Database connected!!!")
})

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(methodOverride('_method'))



const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

app.use('/campgrounds', campgroundsRouter)

app.get('/', (req, res) => {
    res.render('home')
})

app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async(req, res) => {
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async(req, res) => {
    const { id, reviewId } = req.params
    console.log("id: ", id, "reviewId: ", reviewId)
    await Campground.findByIdAndUpdate(id, {$pull: { reviews: reviewId }})
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/campgrounds/${id}`)
}))

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    console.log("Damn, there is an error: ", err)
    const { statusCode = 500, message = 'Something went wrong' } = err
    res.status(statusCode).send(message)
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})