const Player = require('../../models/player')
const NormalizedPlayer = require('../../models/normalizedPlayers')
const mongoose = require('mongoose')


exports.getPlayersFromDB = async function getPlayersFromDB() {
    console.log('ingetplayersfromdb')
    try {
        let rawPlayers = await Player.find({})
        const schema = Object.keys(Player.schema.paths)
        const max = {}
        let players = rawPlayers.map((value, index, array) => {
            for (stat of schema) {
                switch (stat) {
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
                        value[stat] /= value.games
                        if (value[stat] > max[stat] || max[stat] == undefined) {
                            max[stat] = value[stat]
                        }
                }
            }
            return value
        })
        return {
            players: players,
            max: max
        }
    } catch (error) {
        return error.stack
    }
}

exports.normalizePlayers = async function normalizePlayers(rawPlayers) {
    console.log('innormalizeplayers')

    try {
        console.log(rawPlayers.max)
        const normalizedPlayers = rawPlayers.players.map((value, index, array) => {
            for (cat in rawPlayers.max) {
                value[cat] /= rawPlayers.max[cat]
            }
            const playerObject = value.toObject()
            playerObject._id = undefined
            const newPlayer = new NormalizedPlayer(playerObject)
            const savedPlayer = newPlayer.save().then((doc) => {
            }).catch((error) => {
                console.log(error.stack)
            })
            // console.log(newPlayer)
             return newPlayer
        })


        // let players = rawPlayers
        // const newPlayers = await Player.find({})
        // const gamesPlayed = newPlayers.map((value, index, array) => {
        //     for (category of players) {
        //         let label = Object.keys(category)[0]
        //         value[label] /= value.games
        //     }
        //     return value
        // })
        // let normalizedPlayers = []
        // for (category of gamesPlayed) {
        //     let label = Object.keys(category)[0]
        //     let max = Object.values(category)[0][0][label]
        //     for (player of gamesPlayed) {
        //         player[label] /= max
        //         player.normalized = true
        //     }
        // }
        // for (pl of gamesPlayed) {
        //     const playerObject = pl.toObject()
        //     playerObject._id = undefined

        //     const savedPlayer = new NormalizedPlayer(playerObject)
        //     await savedPlayer.save().then((doc) => {
        //         normalizedPlayers.push(doc)
        //     }).catch((error) => {
        //         console.log(error.stack)
        //     })
        // }
        return normalizedPlayers
    } catch (error) {
        return error.stack
    }
}

exports.weightCategories = function weightCategories(players) {
    console.log('inweightCategories')
}