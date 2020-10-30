const Player = require('../../models/player')
const NormalizedPlayer = require('../../models/normalizedPlayers')
const mongoose = require('mongoose')
const WeightedPlayer = require('../../models/weightedPlayers')
//const player = require('../../models/player')


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
        //  console.log(rawPlayers.max)
        const normalizedPlayers = rawPlayers.players.map((value, index, array) => {
            for (cat in rawPlayers.max) {
                value[cat] /= rawPlayers.max[cat]
            }
            const playerObject = value.toObject()
            playerObject._id = undefined
            const newPlayer = new NormalizedPlayer(playerObject)
            newPlayer.save().then().catch((error) => {
                //  console.log(error.stack)
            })
            return newPlayer
        })
        return normalizedPlayers
    } catch (error) {
        return error.stack
    }
}

exports.weightCategories = function weightCategories(rawPlayers) {
    const schema = Object.keys(Player.schema.paths)
    let sums = []
    for (let cat of schema) {
        switch (cat) {
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
                let categorySum = {}
                categorySum[cat] = rawPlayers.reduce((acc, cur, index, array) => {
                    return acc + cur[cat]
                }, 0)
                sums.push(categorySum)
        }
    }
    let totalSum = sums.reduce((acc, curr, index, array) => {
        return acc + Object.values(curr)[0] / 8
    }, 0)
    let weights = sums.map((val, index, array) => {
        let temp = {}
        temp[Object.keys(val)[0]] = totalSum / Object.values(val)[0]
        return temp
    })
   const weightedPlayers = rawPlayers.map((val,index,array) => {
        weights.map((value,i,arr) => {
            val[Object.keys(value)[0]] *= Object.values(value)[0]
            return val
        })
        let playerObject = val.toObject()
        playerObject._id = undefined
        const newPlayer = new WeightedPlayer(playerObject)
        newPlayer.save().then().catch((error) => {
            console.log(error.stack)
        })
        return newPlayer
    })
    return weightedPlayers
}