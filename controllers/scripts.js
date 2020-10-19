const https = require('https')
//const player = require('../models/player')
// const {
//     resolve
// } = require('path')
//const script = require('../scripts/scripts')
//const Player = require('../models/player')
const getTeamIds = require('../helpers/getPlayers/getTeamIds')


exports.getPlayers = (req, res, next) => {
    console.log('hello')
    //teamIdsFunction = getTeamIds.getTeamIds
    async function getPlayers() {
        // console.log('hello from get players')
        try {
            // returns an array
            console.log('hello from get players')
            const teamIdsPromise = await getTeamIds.getTeamIds()
            const teamIds = teamIdsPromise
            //returns array of player objects
            const rostersPromise = await getTeamIds.getRosters(teamIds)
             const rosters = rostersPromise
            // //updates array of player objects
            // const statsPromise = await getStats(players)
            // const players = statsPromise
            // //writes player objects to database
            // const write = await write(players)
            // const check = await check(players)
            res.status(200).json({
                message: 'message',
                teamIds: teamIds,
                roster: rosters
            })
        } catch (error) {
            next(error)
            console.log(error + 'in get team Players')
            res.status(404).json({
                error: error,
                location: 'getTeamPlayers'
            })
        }
    }
    getPlayers()

    // let players = getPlayers()
    // console.log(players)

    // res.status(200).json({
    //     message: 'message',
    //     players: players
    // })
}

// res.status(200).json({
//     message: 'message'
// })
// next()
// }


// exports.getTeamIds = (req, res, next) => {
//     function getTeamIds() {
//         let options = {
//             host: "statsapi.web.nhl.com",
//             path: '/api/v1/teams',
//             method: 'GET'
//         }
//         return new Promise((resolve, reject) => {
//             const request = https.request(options, (response) => {
//                 let rawData = ''
//                 let teamIds = []
//                 response.on('error', (error) => {
//                     console.log(error)
//                     reject(error)
//                 })
//                 response.on('data', (data) => {
//                     rawData += data
//                 })
//                 response.on('end', () => {
//                     try {
//                         // after the call has completed, process the data into the relvant structures, write players into the database
//                         const parsedData = JSON.parse(rawData)
//                         for (team of parsedData.teams) {
//                             teamIds.push(team.id)
//                         }
//                         resolve(teamIds)
//                     } catch (error) {
//                         console.log(error)
//                         reject(error)
//                     }
//                 })
//             })
//             request.end()
//         })
//     }

//     function getPlayers(id) {
//         return new Promise((resolve, reject) => {
//             let rawData = ''
//             let players = []
//             let options = {
//                 host: "statsapi.web.nhl.com",
//                 path: '/api/v1/teams/' + String(id) + '/?expand=team.roster&season=20182019',
//                 method: 'GET'
//             }
//             const request = https.request(options, (response) => {
//                 response.on('error', (error) => {
//                     console.log(error + 'in getplayers')
//                     reject(error)
//                 })
//                 response.on('data', (data) => {
//                     rawData += data
//                 })
//                 response.on('end', () => {
//                     try {
//                         let roster = JSON.parse(rawData)
//                         for (p of roster.teams[0].roster.roster) {
//                             if (p.position.name == 'Goalie' || typeof p.position.name === 'undefined') {
//                                 players.push('skip')
//                             } else {
//                                 let newPlayer = new Player({
//                                     name: p.person.fullName,
//                                     NHLId: p.person.id,
//                                     position: p.position.name
//                                 })
//                                 players.push(newPlayer)
//                             }
//                         }
//                         resolve(players)
//                     } catch (error) {
//                         console.log(error + 'in getplayers')
//                         reject(error)
//                     }
//                 })
//             })
//             request.on('error', (error) => {
//                 console.error(error + 'in getplayers')
//             })
//             request.end()
//         })
//     }

//     function getPlayerStats(player) {
//         //given an array of Ids return a promise to an array of players with stats
//         return new Promise((resolve, reject) => {
//             //goalie stats are different
//             if (player.position == 'Goalie' || player == {}) {
//                 resolve('skip')
//                 reject(error)
//             }
//             let rawData = ''
//             let options = {
//                 host: "statsapi.web.nhl.com",
//                 path: '/api/v1/people/' + String(player.NHLId) + '/stats?stats=statsSingleSeason&season=20182019',
//                 method: 'GET'
//             }
//             const request = new https.request(options, (response) => {
//                 response.on('error', (error) => {
//                     console.log(error + 'getplayerstats')
//                     reject(error)
//                 })
//                 response.on('data', (data) => {
//                     // console.log('in data')
//                     rawData += data
//                 })
//                 response.on('end', () => {
//                     try {
//                         const playerStat = JSON.parse(rawData)
//                         if(typeof playerStat.stats === 'undefined') {
//                             resolve('skip')
//                             console.log(playerStat + 'in getplayerStats')
//                         } else {
//                             resolve(playerStat.stats[0].splits[0])
//                         }
//                        //resolve(playerStat.stats[0].splits[0])
//                     } catch (error) {
//                         console.log(error + 'getplayerstats')
//                         reject(error)
//                     }
//                 })
//             })
//             request.on('error', (error) => {
//                 console.error(error + 'getplayerstats')
//             })
//             request.end()
//         })
//     }

//     async function populatePlayers() {
//         let players = []
//         let playerStats = []
//         try {
//             const teamIdsPromise = await getTeamIds()
//             const teamIds = teamIdsPromise
//             for (id of teamIds) {
//                 await getPlayers(id)
//                 const playersPromise = await getPlayers(id)
//                 const tempPlayers = playersPromise
//                 players.push(tempPlayers)
//             }

//             //cycle through each player, adding stats to the object, return array of objects
//             for (i in players) {
//                 for (pl of players[i]) {
//                     if (pl === 'skip') {
//                         stat = 'skip'
//                         console.log(pl + 'in populatePlayers')
//                     } else {
//                     let playerStatsPromise = await getPlayerStats(pl)
//                     let stat = playerStatsPromise
//                     }
//                    // console.log(stat)
//                     // if (typeof stat === 'undefined') {
//                     //     console.log('undefined stats')
//                     //    // console.log(pl)
//                     // }
//                     // if (typeof stat === 'undefined') {
//                     //     // stat='skip'
//                     //     console.log(stat)
//                     //     console.lof(pl)
//                     // }
//                     // else {
//                     //     stat = 'skip'
//                     // }
//                 }
//             }



//             // const p = await Player.find({})
//             //  let players = playersPromise
//             // for (pl of p) {
//             //    const statsPromise = await getPlayerStats(pl)
//             //    const stats = statsPromise
//             //    playerStats.push(stats)
//             //    if (stats !== 'skip') {
//             //        console.log(pl.NHLId)
//             //     let temp = await Player.updateOne({NHLId: pl.NHLId}, {year: stats.season})
//             //    }
//             //   // let temp = await Player.updateOne({NHLId: pl.NHLId}, {year: stats.season})
//             // }
//             // players = await Player.find({})
//             // getPlayerStats() returns a single players stats from the API, parses an array of arrays where each inner array is the player ids of a sinlge team

//             // for (i in players) {
//             // for (pl in players[i]) {
//             //     // console.log(playerId)
//             //     const playerStatsPromise = await getPlayerStats(players[i][pl])
//             //     const stats = playerStatsPromise
//             //     // console.log(stats)
//             //     if (stats !== 'skip') {
//             //         playerStats.push(stats.stats[0].splits[0])
//             //     } 
//             // }
//             //  }
//             console.log('done')
//             res.status(201).json({
//                 message: 'message',
//                 teamIds: teamIds,
//                 players: players
//                 //   playerStats: playerStats
//                 //  playerCollection: playerCollection
//             })
//         } catch (error) {
//             res.status(404).json({
//                 error: error
//             })
//         }
//         //writePlayerStats() returns nothing and writes each player to the database
//         // await writePlayerStats()
//     }
//     // async function populatePlayers() {
//     //     const players = []
//     //     try {
//     //         console.log("in populate players")
//     //         const allDataPromise = await getTeamIds()
//     //         const allData = allDataPromise
//     //         const teamIds = allData.teamIds
//     //         for (id of teamIds) {
//     //             //   console.log(id)
//     //             const playersPromise = await getPlayersFromTeam(id)
//     //             const newPlayers = playersPromise
//     //             // console.log(newPlayers)
//     //             for (player of newPlayers.teams[0].roster.roster) {
//     //                 // players.push(buildPlayerObject(player))
//     //                 const newPlayer = new Player({
//     //                     name: player.person.fullName,
//     //                     NHLId: parseInt(player.person.id),
//     //                     position: player.position.name
//     //                 })
//     //                 newPlayer.save().then((newPlayer) => {
//     //                         players.push(newPlayer)
//     //                     })
//     //                     .catch((error) => {
//     //                         //console.log(error)
//     //                     })
//     //             }
//     //         }
//     //         // const playerCollection = {}

//     //         // Player.find({}, (err, docs) => {
//     //         //     playerCollection = docs
//     //         // }).then(() => {
//     //         //     res.status(201).json({
//     //         //         allData: allData,
//     //         //         players: players,
//     //         //         playerCollection: playerCollection
//     //         //     })
//     //         //     .catch((error) => {

//     //         //     })
//     //         // })
//     //         // const playerCollection = playerCollectionPromise
//     //         // console.log(playerCollection)
//     //         // const playerStatsPromise = await getRawPlayerStats(id)


//     //         res.status(201).json({
//     //             allData: allData,
//     //             players: players
//     //             //  playerCollection: playerCollection
//     //         })
//     //     } catch (error) {
//     //         res.status(400).json({
//     //             error: error
//     //         })
//     //     }
//     // }
//     populatePlayers()
// }

// exports.getTeamRosters = (req, res, next) => {
//     res.status(201).json({
//         message: 'hello'
//     })
//     console.log('hello')
// }

// function getRawPlayerStats(id) {
//     // console.log(id)
//     // retrieves stats object, appends to player
//     return new Promise((resolve, reject) => {
//       const apiRequestData = new XMLHttpRequest()
//       apiRequestData.open('GET', 'https://statsapi.web.nhl.com/api/v1/people/' + id + '/stats?stats=yearByYear')
//       apiRequestData.onreadystatechange = function () {
//         if (apiRequestData.readyState === 4) {
//           const response = JSON.parse(apiRequestData.response)
//           resolve(response)
//           reject('error')
//         }
//       }
//       apiRequestData.send()
//     })
//   }