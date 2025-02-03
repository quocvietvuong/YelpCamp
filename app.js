const express = require('express')
const mongoose = require('mongoose')
const path = require('path');
const ejsMate = require('ejs-mate') // just one of many engine
const session = require('express-session')
const ExpressError = require('./utils/ExpressError')
const methodOverride = require('method-override')
const campgroundsRouter = require('./routes/campgrounds')
const campgroundReviewRouter = require('./routes/campgroundReview')

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

const sessionConfig = {
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
}
app.use(session(sessionConfig))

app.use((req, res, next) => {
    console.log('Req: ', req.url)
    console.log('Session Data:', req.session);
    next(); // Pass control to the next middleware or route handler
});

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/campgrounds', campgroundsRouter)
app.use('/campgrounds/:id/reviews', campgroundReviewRouter )


app.get('/', (req, res) => {
    res.render('home')
})

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