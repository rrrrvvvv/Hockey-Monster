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
        // let score 
        const normalizedPlayers = await Promise.all(rawPlayers.players.map(async (value, index, array) => {
            let score = 0
            for (cat in rawPlayers.max) {
                value[cat] /= rawPlayers.max[cat]
                score += value[cat]
            }
            const playerObject = value.toObject()
            playerObject._id = undefined
            const newPlayerNorm = new NormalizedPlayer(playerObject)
            newPlayerNorm.score = score
            await newPlayerNorm.save().then().catch((error) => {
                //  console.log(error.stack)
            })
            return newPlayerNorm
        }))
        // console.log(normalizedPlayers)
        return normalizedPlayers
    } catch (error) {
        return error.stack
    }
}

exports.weightCategories = function weightCategories(rawPlayers) {
    // console.log(rawPlayers)
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
            case 'score':
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
    let score = 0
        weights.map((value,i,arr) => {
            val[Object.keys(value)[0]] *= Object.values(value)[0]
            //  console.log(val[Object.keys(value)[0]])
            score += val[Object.keys(value)[0]]
            return val
        })
        // console.log(val)
        let playerObject = val.toObject()
        playerObject._id = undefined
        const newPlayer = new WeightedPlayer(playerObject)
        newPlayer.score = score
        newPlayer.save().then().catch((error) => {
            console.log(error.stack)
        })
        return newPlayer
    })

    return weightedPlayers
}