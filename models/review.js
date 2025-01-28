const mongoose = require('mongoose')
const Schema = mongoose.Schema

const reviewSchema = new Schema({
  body: String, // THIS IS A GREAT PLACE
  rating: Number,
})

module.exports = mongoose.model("Review", reviewSchema)
