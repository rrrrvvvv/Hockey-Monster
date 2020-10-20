const Player = require('../../models/player')
const NormalizedPlayer = require('../../models/normalizedPlayers')
const mongoose = require('mongoose')
//const player = require('../../models/player')


exports.getPlayersFromDB = async function getPlayersFromDB() {
    console.log('ingetplayersfromdb')
    try {
        let players = []
        const schema = Player.schema.paths
        const keys = Object.keys(schema)
        for (let key of keys) {
            switch (key) {
                case 'name':
                case 'NHLId':
                case 'team':
                case 'year':
                case 'position':
                case 'games':
                case 'atoi':
                case 'normalized':
                case 'weighted':
                case '_id':
                case '__v':
                    break
                default:
                    let category = {}
                    let sortedPlayersPromise = await Player.find({}, 'name NHLId year position team games atoi' + ' ' + key).sort('-' + key)
                    let sortedPlayers = sortedPlayersPromise
                    category[key] = sortedPlayers
                    players.push(category)
            }
        }
        return players
    } catch (error) {
        return error.stack
    }
}

exports.normalizePlayers = async function normalizePlayers(rawPlayers) {
    console.log('innormalizeplayers')
    try {
        let players = rawPlayers
        const newPlayers = await Player.find({})
        let normalizedPlayers = []
        for (category of players) {
            let label = Object.keys(category)[0]
            let max = Object.values(category)[0][0][label]
            for (player of newPlayers) {
                player[label] /= max
                player.normalized = true
            }
        }
        for (pl of newPlayers) {
            const playerObject = pl.toObject()
            playerObject._id = undefined

            const savedPlayer = new NormalizedPlayer(playerObject)
            await savedPlayer.save().then((doc) => {
                normalizedPlayers.push(doc)
            }).catch((error) => {
                console.log(error.stack)
            })
        }
        return normalizedPlayers
    } catch (error) {
        return error.stack
    }
}

exports.weightCategories = function weightCategories(players) {
    console.log('inweightCategories')
}