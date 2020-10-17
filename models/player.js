const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const playerSchema = mongoose.Schema({
    name: {
        type: String
    },
    NHLId:{
        type: Number
    },
    year: String,
    position: String,
    year: String,
    goals: Number,
    assists: Number,
    points: Number,
    pims: Number,
    ppp: Number,
    sog: Number,
    hit: Number,
    blk: Number,
    games: Number,
    atoi: Number,
})

playerSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Player', playerSchema)