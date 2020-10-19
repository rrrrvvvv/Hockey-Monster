const https = require('https')
const player = require('../../models/player')
const Player = require('../../models/player')

exports.callGenerator = function callGenerator(options) {
    // console.log('hello from call generator')
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
        default:
    }
}

exports.dataProcessing = function dataProcessing(data, location) {
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
        default:
    }
}

//exports.filterResults = filterResults
//exports.dataProcessing = dataProcessing