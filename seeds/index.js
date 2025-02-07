const mongoose = require('mongoose')
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')
const Campground = require('../models/campground')

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const db = mongoose.connection
db.on("error", console.error.bind(console,"connection error:"))
db.once("open", () => {
    console.log("Database connected!!!")
})

const sample = (array) => {
    if (!Array.isArray(array) || array.length === 0) {
        throw new Error('Input must be a non-empty array');
    }
    return array[Math.floor(Math.random() * array.length)];
};

const seedDB = async () => {
    await Campground.deleteMany({})
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 20) + 10
        const camp = new Campground({
            author: '67a5e01f7ad61ccc7a62eb20',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: `https://picsum.photos/400?random=${Math.random()}`,
            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quis ipsam earum nobis, magnam cum dolores distinctio quasi voluptate commodi temporibus amet sequi vel eius consequatur possimus iusto doloremque est eaque!',
            price,
        })
        await camp.save()
    }
}

seedDB().then(() => {
    db.close()
})