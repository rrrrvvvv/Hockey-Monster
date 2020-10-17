const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path')
const scriptRoutes = require('./routes/scripts')
const populatePlayersRoutes = require('./routes/populateplayers')

mongoose.connect('mongodb+srv://Geoff:E7VX4v6VZ2MBvBA@cluster0.nq3nb.mongodb.net/Cluster0?retryWrites=true&w=majority')
    .then(() => {
        console.log('Success connected to MongoDB Atlas')
    })
    .catch((error) => {
        console.log('unable to connect to MongoDB Atlas')
        console.error(error)
    })

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-type, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    next()
})

app.use(bodyParser.json())
app.set('views', './views')
app.set('view engine', 'ejs')
app.use('/populateplayers', populatePlayersRoutes)
app.use('/scripts', scriptRoutes)

module.exports = app