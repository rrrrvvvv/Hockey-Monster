const https = require('https')
const player = require('../models/player')
// const {
//     resolve
// } = require('path')
//const script = require('../scripts/scripts')
const Player = require('../models/player')


exports.getTeamIds = (req, res, next) => {
    function getTeamIds() {
        let options = {
            host: "statsapi.web.nhl.com",
            path: '/api/v1/teams',
            method: 'GET'
        }
        return new Promise((resolve, reject) => {
            const request = https.request(options, (response) => {
                let rawData = ''
                let teamIds = []
                response.on('error', (error) => {
                    console.log(error)
                    reject(error)
                })
                response.on('data', (data) => {
                    rawData += data
                })
                response.on('end', () => {
                    try {
                        // after the call has completed, process the data into the relvant structures, write players into the database
                        const parsedData = JSON.parse(rawData)
                        for (team of parsedData.teams) {
                            teamIds.push(team.id)
                        }
                        resolve(teamIds)
                    } catch (error) {
                        console.log(error)
                        reject(error)
                    }
                })
            })
            request.end()
        })
    }

    function getPlayers(id) {
        return new Promise((resolve, reject) => {
            let rawData = ''
            let players = []
            let options = {
                host: "statsapi.web.nhl.com",
                path: '/api/v1/teams/' + String(id) + '/?expand=team.roster&season=20182019',
                method: 'GET'
            }
            const request = https.request(options, (response) => {
                response.on('error', (error) => {
                    console.log(error)
                    reject(error)
                })
                response.on('data', (data) => {
                    rawData += data
                })
                response.on('end', () => {
                    try {
                        // let playerIds = []
                        let roster = JSON.parse(rawData)
                        //console.log(roster.teams[0].roster.roster)
                        for (p of roster.teams[0].roster.roster) {
                            // console.log(player.person.id)
                            let newPlayer = new Player({
                                name: p.person.fullName,
                                NHLId: p.person.id,
                                position: p.position.name
                            })
                            players.push(newPlayer)
                        }
                        resolve(players)
                    } catch (error) {
                        reject(error)
                    }
                })
            })
            request.end()
        })
    }

    function getPlayerStats(player) {
        //given an array of Ids return a promise to an array of players with stats
        return new Promise((resolve, reject) => {
            // if (player.position == 'Goalie') {
            //     resolve({})
            // }
            let rawData = ''
            let options = {
                host: "statsapi.web.nhl.com",
                path: '/api/v1/people/' + String(player.NHLId) + '/stats?stats=statsSingleSeason&season=20182019',
                method: 'GET'
            }
            const request = new https.request(options, (response) => {
                response.on('error', (error) => {
                    console.log(error)
                    reject(error)
                })
                response.on('data', (data) => {
                    // console.log('in data')
                    rawData += data
                })
                response.on('end', () => {
                    try {
                        const playerStat = JSON.parse(rawData)
                        if (playerStat == null) {
                            resolve('')
                        } else {
                            // console.log(playerStat)
                            resolve(playerStat)
                        }

                    } catch (error) {
                        reject(error)
                    }
                })
            })
            request.end()
        })
    }

    async function populatePlayers() {
        let players = []
        let playerStats = []
        try {
            // getTeamIds() returns a promise of an array of team IDs
            const teamIdsPromise = await getTeamIds()
            const teamIds = teamIdsPromise
            // getPlayerIds() returns an array of player Ids, by making a call to each team id endpoint
            for (id of teamIds) {
                const playersPromise = await getPlayers(id)
                const tempPlayers = playersPromise
                //  console.log(id)
                //  console.log(tempPlayerIds)
                players.push(tempPlayers)
            }
            // getPlayerStats() returns a single players stats from the API, parses an array of arrays where each inner array is the player ids of a sinlge team

            for (i in players) {
                for (player of players[i]) {
                    // console.log(playerId)
                    const playerStatsPromise = await getPlayerStats(player)
                    const stats = playerStatsPromise
                    // console.log(stats)
                   // playerStats.push(stats)
                }
            }
            console.log('done')
            // console.log(players)
            // for (player of playerStats) {
                
            // }
            res.status(201).json({
                message: 'message',
                teamIds: teamIds,
                players: players
               // playerStats: playerStats
                //  playerCollection: playerCollection
            })
        } catch (error) {
            res.status(404).json({
                error: error
            })
        }
        //writePlayerStats() returns nothing and writes each player to the database
        // await writePlayerStats()
    }
    // async function populatePlayers() {
    //     const players = []
    //     try {
    //         console.log("in populate players")
    //         const allDataPromise = await getTeamIds()
    //         const allData = allDataPromise
    //         const teamIds = allData.teamIds
    //         for (id of teamIds) {
    //             //   console.log(id)
    //             const playersPromise = await getPlayersFromTeam(id)
    //             const newPlayers = playersPromise
    //             // console.log(newPlayers)
    //             for (player of newPlayers.teams[0].roster.roster) {
    //                 // players.push(buildPlayerObject(player))
    //                 const newPlayer = new Player({
    //                     name: player.person.fullName,
    //                     NHLId: parseInt(player.person.id),
    //                     position: player.position.name
    //                 })
    //                 newPlayer.save().then((newPlayer) => {
    //                         players.push(newPlayer)
    //                     })
    //                     .catch((error) => {
    //                         //console.log(error)
    //                     })
    //             }
    //         }
    //         // const playerCollection = {}

    //         // Player.find({}, (err, docs) => {
    //         //     playerCollection = docs
    //         // }).then(() => {
    //         //     res.status(201).json({
    //         //         allData: allData,
    //         //         players: players,
    //         //         playerCollection: playerCollection
    //         //     })
    //         //     .catch((error) => {

    //         //     })
    //         // })
    //         // const playerCollection = playerCollectionPromise
    //         // console.log(playerCollection)
    //         // const playerStatsPromise = await getRawPlayerStats(id)


    //         res.status(201).json({
    //             allData: allData,
    //             players: players
    //             //  playerCollection: playerCollection
    //         })
    //     } catch (error) {
    //         res.status(400).json({
    //             error: error
    //         })
    //     }
    // }
    populatePlayers()
}

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