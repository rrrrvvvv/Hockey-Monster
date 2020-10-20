const https = require('https')
//const player = require('../models/player')
// const {
//     resolve
// } = require('path')
//const script = require('../scripts/scripts')
//const Player = require('../models/player')
const getTeamIds = require('../helpers/getPlayers/getTeamIds')
const getRanks = require('../helpers/getRanks/getRanks')

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
             const statsPromise = await getTeamIds.getStats(rosters)
             const playerStats = statsPromise
            //writes player objects to database
            const writePromise = await getTeamIds.writePlayers(playerStats)
            const write = writePromise
            // const check = await check(players)
            res.status(200).json({
                message: 'message',
              //  teamIds: teamIds,
             //   roster: rosters,
                stats: playerStats,
              written: write
            })
        } catch (error) {
            next(error)
            console.log(error + 'in getPlayers')
            res.status(404).json({
                error: error,
                location: 'getPlayers'
            })
        }
    }
    getPlayers()
}

exports.getRanks = (req,res,next) => {
   // console.log('ingetRanks')
    async function getRankings() {
    try {
        const getPlayersPromise = await getRanks.getPlayersFromDB()
        const getPlayersFromDB = getPlayersPromise
        const normalizedPlayersPromise = await getRanks.normalizePlayers(getPlayersFromDB)
        const normalizedPlayers = normalizedPlayersPromise
        //  const weightedCategories = getRanks.weightCategories(normalizedPlayers)
        

        console.log('ingetRanks')
        res.status(201).json({
            message: 'ingetranks',
            players: getPlayersFromDB,
            normalized: normalizedPlayers
        })

    } catch (error) {
        res.status(400).json({
            error: error.stack,
            location: getRanks
        })

    }
}
getRankings()
} 