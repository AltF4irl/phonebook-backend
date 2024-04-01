require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Contact = require('./models/contact')
const app = express()

const errorHandler = (err, req, res, next) => {
    console.log(err.message)
    if(err.name === 'CastError') {
        return res.status(400).send({ error: 'Malformatted id' })
    } else if (err.name === 'ValidationError') {
        return res.status(400).json({ error: err.message })
    }
    next(err)
}

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())


morgan.token('body', (req) => JSON.stringify(req.body))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/', (req, res) => {
    res.send('<h1> Hello There!</h1>')
})

app.get('/api/contacts', (req, res) => {
    Contact.find({}).then(contacts => res.json(contacts))
})

app.get('/api/info', (req, res) => {
    Contact.find({}).then(contacts => {
        const contactsCount = contacts.length
        const timeOfRequest = new Date().toString()
        res.send(`<p>Phonebook has info for ${contactsCount} people</p><p>${timeOfRequest}</p>`)
    })
})

app.get('/api/contacts/:id', (req, res, next) => {
    Contact.findById(req.params.id)
    .then(contact => {
        if (contact) {
            res.json(contact)
        } else {
            res.status(404).end()
        }

    })
    .catch(err => next(err))
})

app.post('/api/contacts', (req, res, next) => {
    const body = req.body

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'content missing'
        })
    }

    const contact = new Contact({
        name: body.name,
        number: body.number
    })

    Contact.find({ name: body.name })
    .then(queryResult => {
        console.log(queryResult)
        if (queryResult.length === 0) {
            contact.save()
            .then(queryResult => res.json(queryResult))
            .catch(err => next(err))
        } else {
            return res.status(400).json({
                error: `${body.name} exists`
            })
        }
    })
})

app.delete('/api/contacts/:id',  (req, res, next) => {
    Contact.findOneAndDelete({ _id: req.params.id })
    .then(deletedContact => res.json(deletedContact))
    .catch(err => next(err))
})

app.put('/api/contacts/:id', (req, res, next) => {
    const currentContact = req.body

    console.log(currentContact, 'ccurrent')

    Contact.findOneAndUpdate({ _id: req.params.id }, currentContact, { new: true, runValidators: true, context: 'query' })
    .then(updatedContact => {
        res.status(201).json(updatedContact)
    })
    .catch(err => next(err))
})

// eslint-disable-next-line no-undef
const PORT = process.env.PORT
// const PORT = 3001
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})

app.use(errorHandler)