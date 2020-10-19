const https = require('https')
//const player = require('../../models/player')
const Player = require('../../models/player')

exports.callGenerator = function callGenerator(options) {
    //console.log('hello from call generator')
    return new Promise((resolve, reject) => {
        const request = https.request(options, (response) => {
            let rawData = ''
            response.on('error', (error) => {
                console.log(error + 'in callGenerator response')
                console.log(error.stack)
                reject(error)
            })
            response.on('aborted', (error) => {
                console.log(error + 'in callGenerator response')
                console.log(error.stack)
                reject(error)
            })
            response.on('data', (data) => {
                rawData += data
            })
            response.on('end', () => {
                try {
                    const parsedData = JSON.parse(rawData)
                    resolve(parsedData)
                } catch (error) {
                    console.log(error + 'in callgenerator response end')
                    console.log(error.stack)
                    reject(error)
                }
            })
        })
        request.on('error', (error) => {
            console.log(error + 'in callGenerator request')
            console.log(error.stack)
        })
        request.end()
    })
}

exports.responseFilter = function responseFilter(data, location) {
    switch (location) {
        case 'getTeamIds':
            return data
            break
        case 'getRosters':
            let dataArray = Object.values(data)
            let teamRoster = Object.values(dataArray[1][0].roster.roster)
            let filteredTeamRoster = teamRoster.filter((value, index, array) => {
                // console.log(value.position.code)
                return value.position.code !== 'G'
            })
            data.teams[0].roster.roster = filteredTeamRoster
            let roster = data
            return roster
            break
        case 'getStats':
            let filteredStats = data
            let statsKeys = Object.keys(data.stats.stats[0].splits[0].stat)
            let statsValues = Object.values(data.stats.stats[0].splits[0].stat)
            let check = statsKeys.filter((value, index, array) => {
                switch (value) {
                    case 'games':
                        if (statsValues[index] < 20) {
                            filteredStats = null
                            // return null
                        }
                        break
                    case 'timeonIcePerGame':
                        if (parseInt(statsValues[index].split(":"))[0] < 10) {
                            filteredStats = null
                            //  return null
                        }
                        break
                    default:
                        break
                }
            })
            return filteredStats
            break
        default:
    }
}

exports.dataProcessing = function dataProcessing(data, location, year) {
    switch (location) {
        case 'getTeamIds':
            teamIds = []
            for (tm of data.teams) {
                let team = {
                    id: tm.id,
                    name: tm.teamName
                }
                teamIds.push(team)
            }
            return teamIds
            break
        case 'getRosters':
            let roster = []
            let dataArray = Object.values(data)
            let teamRoster = Object.values(dataArray[1][0].roster.roster)
            // roster = dataArray
            for (pl of teamRoster) {
                // roster.push(player.position)
                // console.log('once')
                // for (pl of team) {
                newPlayer = new Player({
                    name: pl.person.fullName,
                    NHLId: pl.person.id,
                    team: data.teams[0].abbreviation,
                    year: year,
                    position: pl.position.abbreviation
                })
                roster.push(newPlayer)
                // }
            }
            return roster
            break
        case 'getStats':
            if (data !== null) {
                let playerStats = data.stats.stats[0].splits[0].stat
                data.player.goals = playerStats.goals
                data.player.assists = playerStats.assists
                data.player.points = playerStats.points
                data.player.pims = playerStats.pims
                data.player.ppp = playerStats.powerPlayPoints
                data.player.sog = playerStats.shots 
                data.player.hits = playerStats.hits 
                data.player.blks = playerStats.blocked 
                data.player.games = playerStats.games
                data.player.atoi = parseInt(playerStats.timeOnIcePerGame.split(":")[0]) + (parseInt(playerStats.timeOnIcePerGame.split(":")[1])/60)

                return data.player
            } else {
                return
            }
            //  let playerStats = data.stats
            // for (pl in data) {
            //   //  pl.player.goals = pl.stats[0].splits[0].stat.goals
            //   //  playerStats.push(pl)
            // }
            // return playerStats
            break
        default:
    }
}