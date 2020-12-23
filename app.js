const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path')
const scriptRoutes = require('./routes/scripts')
const homePageRoutes = require('./routes/homepage')
const populatePlayersRoutes = require('./routes/populateplayers')
const getRanksRoutes = require('./routes/getranks')
const getTeamRoutes = require('./routes/getteam')

mongoose.connect('mongodb+srv://Geoff:E7VX4v6VZ2MBvBA@cluster0.nq3nb.mongodb.net/Cluster0?retryWrites=true&w=majority')
// mongoose.connect('')
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
// app.use(express.urlencoded())
// app.use(express.json())
// app.use(bodyParser)
// app.use(express.static('scripts'))
app.set('views', './views')
app.set('view engine', 'ejs')
app.use('/populateplayers', populatePlayersRoutes)
app.use('/scripts', scriptRoutes)
app.use('/', homePageRoutes)
app.use('/getranks', getRanksRoutes)
app.use('/getteam', getTeamRoutes)

module.exports = app