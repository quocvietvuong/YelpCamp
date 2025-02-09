const User = require('../models/user')

const renderRegistrationForm = (req, res) => {
  res.render('users/register')
}

const registerUser = async (req, res, next) => {
  try {
    const { email, username, password } = req.body
    const user = new User({ email, username })
    const registeredUser = await User.register(user, password)
    req.login(registeredUser, err => {
      if (err) return next(err)
      req.flash('success', `Welcome to YelpCamp, ${username}!`)
      res.redirect('/campgrounds')
    })
  } catch (e) {
    req.flash('error', e.message)
    res.redirect('/register')
  }
}

const renderLogin = (req, res) => {
  res.render('users/login')
}

const login = (req, res) => {
  req.flash('success', 'Welcome back')
  const redirectUrl = res.locals.returnTo || '/campgrounds'
  res.redirect(redirectUrl)
}

const logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
        return next(err);
    }
    req.flash('success', 'Goodbye!');
    res.redirect('/campgrounds');
  })
}

module.exports = { renderRegistrationForm, registerUser, renderLogin, login, logout }