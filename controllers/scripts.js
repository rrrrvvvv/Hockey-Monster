const https = require('https')
const script = require('../scripts/scripts')


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

    // getTeamIds().then((teamIds) => {
    //     res.status(201).json(teamIds)
    // })

    async function populatePlayers() {
        const players = []


        try {
            console.log("in populate players")
            const allDataPromise = await getTeamIds()
            const allData = allDataPromise
            const teamIds = allData.teamIds

            for ( id of teamIds) {
             //   console.log(id)
               const playersPromise = await getPlayersFromTeam(id)
                const newPlayers = playersPromise
                console.log(newPlayers)
               for (player of newPlayers.teams[0].roster.roster) {
                   players.push(player)
               }
            }

           // const rosterPromise = await getPlayersFromTeam(1)
          //  const roster = rosterPromise

           // console.log(roster)




            res.status(201).json({
                allData: allData,
                players: players
                
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

// async function populatePlayers() {
//     // gets all players into an array from internet
//     try {
//       const teamIdsPromise = getTeamIds()
//       const teamIds = await teamIdsPromise
//       const players = [] // want an array of all players playing in the NHL

//       for (id of teamIds) {
//         const playersPromise = getPlayersFromTeam(id)
//         const newPlayers = await playersPromise
//         for (player of newPlayers.teams[0].roster.roster) {
//           players.push(buildPlayerObject(player)) // returns a player, call for each player on roster in each team
//         }
//       }



//       for (player of players) {
//         let rawPlayerStats = {}
//         const rawPlayerStatsPromise = getRawPlayerStats(player.id)
//         rawPlayerStats = await rawPlayerStatsPromise


//         player.stats = filterRawPlayerStats(rawPlayerStats, player)


//       }

//       const duplicates = players.filter((value, index, arr) => {
//         let x = index + 1
//         for (x; x < arr.length; x++) {
//           if (arr[x].id == value.id) {
//             players.splice(x, 1)
//           }
//         }

//       })


//       return players
//     } catch (errorResponse) {
//       console.log('error')
//     }
//   }