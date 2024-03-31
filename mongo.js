const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
} else if (process.argv.length === 4) {
    console.log('phone number should be specified as a rguments')
    process.exit(1)
}


const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://altf4:${password}@fullstackopen.hq5elwu.mongodb.net/phonebookApp?retryWrites=true&w=majority`
mongoose.connect(url)

const contactSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Contact = mongoose.model('Contact', contactSchema)

const contact = new Contact({
    name: name,
    number: number,
})

if (process.argv.length === 3) {
    console.log('Only password specified, showning database content...')
    console.log('Phonebook:')
    Contact.find({}).then(result => {
        result.forEach(contact => console.log(contact.name, contact.number))
        mongoose.connection.close()
    })
} else {
    contact.save().then(result => {
        console.log(`added ${result.name} number ${result.number} to phonebook `)
        mongoose.connection.close()
    })
}

