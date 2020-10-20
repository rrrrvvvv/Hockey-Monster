const Player = require('../../models/player')
const mongoose = require('mongoose')


exports.getPlayersFromDB = async function getPlayersFromDB() {
    console.log('ingetplayersfromdb')
    try {
        let players = []
        const schema = Player.schema.paths
        // Player.playerSchema.schema.eachPath((name,type) => {
        //     console.log(path)
        //     keys.push(path)
        // })
        const keys = Object.keys(schema)
       // console.log(keys)
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
                    console.log(key)
                    let sortedPlayersPromise = await Player.find({}).sort('-' + key)
                    let sortedPlayers = sortedPlayersPromise
                    category[key] = sortedPlayers
                    //console.log(key)
                    players.push(category)
            }
        }
      //  players.push(category)
        return players
        // const playersPromise = await Player.find({}).sort('-goals')
        // const players = playersPromise
        // return players
    } catch (error) {
        return error.stack
    }
}

exports.normalizePlayers = async function normalizePlayers(players) {
    console.log('innormalizeplayers')
    try {

        // categories = Object.values(players)
        // findMax()
        // divideCategories()
        // savePlayers()

        return players
    } catch (error) {
        return error.stack

    }
}

exports.weightCategories = function weightCategories(players) {
    console.log('inweightCategories')
}