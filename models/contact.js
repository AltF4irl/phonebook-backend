const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

// eslint-disable-next-line no-undef
const url = process.env.MONGODB_URI
console.log('Connecting to', url)

mongoose.connect(url)
.then(result => {
    console.log('Connected to MongoDB', result)
})
.catch(err => {
    console.log('Error connecting to MongoDB:', err.message)
})

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        minLength: 9,
        required: [true, 'User phone number required'],
        validate: {
            validator: (v) => /^\d{2,3}-\d+$/.test(v),
            message: props => `${props.value} is not a valid phone number!`
        }
    }
})

contactSchema.set('toJSON', {
    transform: (_doc, returnedContact) => {
        returnedContact.id = returnedContact._id.toString()
        delete returnedContact._id
        delete returnedContact.__v
    }
})

module.exports = mongoose.model('Contact', contactSchema)