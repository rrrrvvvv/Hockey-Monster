const https = require('https')
//const script = require('../scripts/scripts')
const Player = require('../models/player')


exports.getTeamIds = (req, res, next) => {

    function getTeamIds() {

        let options = {
            host: "statsapi.web.nhl.com",
            path: '/api/v1/teams',
            method: 'GET'
            // secureProtocol: 'TLSv1_method'
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
                        let totalData = {
                            teamIds: teamIds,
                            parsedData: parsedData
                        }

                        // console.log(teamIds)
                        // res.status(201).json(totalData)
                        resolve(totalData)
                    } catch (error) {
                        console.log(error)
                        reject(error)

                    }
                })

            })
            request.end()
        })
    }


    function getPlayersFromTeam(teamId) {
        let options = {
            host: "statsapi.web.nhl.com",
            path: '/api/v1/teams/' + String(teamId) + '/?expand=team.roster&season=20182019',
            method: 'GET'
            // secureProtocol: 'TLSv1_method'
        }
        // console.log('/api/v1/teams/' + String(teamId) + '/?expand=team.roster&season=20182019')
        let rawData = ''

        return new Promise((resolve, reject) => {

            //   console.log('inside promise')

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
                        let roster = JSON.parse(rawData)
                        resolve(roster)

                    } catch (error) {
                        reject(error)

                    }
                })


            })
            request.end()

        })
    }

    async function populatePlayers() {
        const players = []
        try {
            console.log("in populate players")
            const allDataPromise = await getTeamIds()
            const allData = allDataPromise
            const teamIds = allData.teamIds
            for (id of teamIds) {
                //   console.log(id)
                const playersPromise = await getPlayersFromTeam(id)
                const newPlayers = playersPromise
                // console.log(newPlayers)
                for (player of newPlayers.teams[0].roster.roster) {
                    // players.push(buildPlayerObject(player))
                    const newPlayer = new Player({
                        name: player.person.fullName,
                        NHLId: parseInt(player.person.id),
                        position: player.position.name
                    })
                    newPlayer.save().then((newPlayer) => {
                        players.push(newPlayer)
                    })
                    .catch((error) => {
                        //console.log(error)
                    })
                }
            }
           // const playerCollection = {}

            // Player.find({}, (err, docs) => {
            //     playerCollection = docs
            // }).then(() => {
            //     res.status(201).json({
            //         allData: allData,
            //         players: players,
            //         playerCollection: playerCollection
            //     })
            //     .catch((error) => {

            //     })
            // })
           // const playerCollection = playerCollectionPromise
           // console.log(playerCollection)
           // const playerStatsPromise = await getRawPlayerStats(id)


            res.status(201).json({
                allData: allData,
                players: players
              //  playerCollection: playerCollection
            })
        } catch (error) {
            res.status(400).json({
                error: error
            })
        }
    }
    populatePlayers()
}

exports.getTeamRosters = (req, res, next) => {
    res.status(201).json({
        message: 'hello'
    })
    console.log('hello')
}

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