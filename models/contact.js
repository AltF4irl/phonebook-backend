const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI
console.log('Connecting to', url)

mongoose.connect(url)
.then(result => {
    console.log("Connected to MongoDB")
})
.catch(err => {
    console.log("Error connecting to MongoDB:", err.message)
})

const contactSchema = new mongoose.Schema({
    name: String,
    number: String,
})

contactSchema.set('toJSON', {
    transform: (doc, returnedContact) => {
        returnedContact.id = returnedContact._id.toString()
        delete returnedContact._id
        delete returnedContact.__v
    }
})

module.exports = mongoose.model('Contact', contactSchema)