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
                  //  console.log(key)
                    let sortedPlayersPromise = await Player.find({},'name NHLId year position team games atoi' + ' ' + key).sort('-' + key)
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

exports.normalizePlayers = async function normalizePlayers(rawPlayers) {
    console.log('innormalizeplayers')
    try {
        let players = []
       // let keys = []
        for (category of rawPlayers) {
            let label = Object.keys(category)[0]
            playerArray = Object.values(category)[0]
            let max = playerArray[0][label]
            let keys = []
            for (pl of playerArray) {
             //   console.log(pl[label],max)
            // let norm =  pl[label]/max
            // let keys = []
            //  console.log(pl) 
            //   keys.push(norm)
                 keys.push(pl[label]/max)

            }
            players.push(keys)
        }
     //   const players = Object.keys(rawPlayers)
       // let keys = []
       // let maxes = []
    //    const keyArray = Object.keys(rawPlayers)
    //    for (ctgy of keyArray) {
    //        players.push(ctgy.key[0])
    //    }
        

        // for (cat in rawPlayers) {
        //     rawPlayers[cat]
        //     let category = String(Object.keys(cat))
        //     //console.log(key)
            
        //     let max = Object.values(cat)
        //    // maxes = max[0][key]
        //     players.push(category)
        // }
        // const keys = Object.keys(rawPlayers)
        // console.log(keys)
    //     for (key in keys) {
    //         let playerArray = rawPlayers[key]
    //         players.push(playerArray)
    //     // for (pl of playerArray) {
    //     //     players.push(pl)
    //     // }
    // }
        // normalize
        // save

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