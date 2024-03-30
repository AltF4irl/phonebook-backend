const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()


app.use(cors())
app.use(express.json())


morgan.token('body', (req, res) => JSON.stringify(req.body))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let contacts = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.use(express.static('dist'))

const generateId = () => {
    return Math.floor(Math.random() * 10000)
}

app.get('/', (req, res) => {
    res.send("<h1> Hello There!</h1>")
})

app.get('/api/contacts', (req, res) => {
    res.json(contacts)
})

app.get('/api/info', (req, res) => {
    const contactsCount = contacts.length
    const timeOfRequest = new Date().toString()

    res.send(`<p>Phonebook has info for ${contactsCount} people</p><p>${timeOfRequest}</p>`)
})

app.get('/api/contacts/:id', (req, res) => {
    const id = Number(req.params.id)
    const contact = contacts.find(contact => contact.id === id)

    if(contact) {
        res.json(contact)
    } else { 
        res.status(404).json({
            error: 'content missing'
        })
    }
    
})

app.post('/api/contacts', (req, res) => {
    const body = req.body

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'content missing'
        })
    }

    if(contacts.find(contact => contact.name === body.name)) {
        return res.status(400).json({
            error: `${body.name} exists`
        })
    }

    const contact = {
        number: body.number,
        name: body.name,
        id: generateId()
    }

    contacts = contacts.concat(contact)

    res.json(contact)
})

app.delete('/api/contacts/:id',  (req, res) => {
    const id = Number(req.params.id)

    deletedContact = contacts.find(contact => contact.id === id)
    contacts = contacts.filter(contact => contact.id !== id)

    res.json(deletedContact)    
})

app.put('/api/contacts/:id', (req, res) => {
    const id = Number(req.params.id)
    const currentContact = req.body 

    console.log(currentContact, "ccurrent");

    contacts = contacts.map(contact => contact.id === id? currentContact : contact)

    res.status(201).json(currentContact)
})

const PORT = process.env.PORT || 3001
// const PORT = 3001
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})