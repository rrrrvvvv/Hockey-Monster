const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const playerSchema = mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
    NHLId:{
        type: Number, 
        unique: true
    },
    team: String,
    year: String,
    position: String,
    goals: Number,
    assists: Number,
    points: Number,
    pims: Number,
    ppp: Number,
    sog: Number,
    hits: Number,
    blks: Number,
    games: Number,
    atoi: Number,
    normalized: Boolean,
    weighted: Boolean

})

playerSchema.plugin(uniqueValidator)

//exports.playerSchema = playerSchema
module.exports = mongoose.model('Player', playerSchema)
//module.exports = mongoose.model('NormalizedPlayer', normalizedPlayerSchema)