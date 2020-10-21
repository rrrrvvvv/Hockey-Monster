const https = require('https')
const Player = require('../../models/player')
const helpers = require('./helpers')

exports.getTeamIds = async function getTeamIds() {
  console.log('hello from getTeamIds')
  let options = {
    host: "statsapi.web.nhl.com",
    path: '/api/v1/teams',
    method: 'GET'
  }
  let callPromise = await helpers.callGenerator(options)
  let callResult = callPromise
  let filteredResult = helpers.responseFilter(callResult, 'getTeamIds')
  let teamIdsArray = helpers.dataProcessing(filteredResult, 'getTeamIds')
  return teamIdsArray
}
exports.getRosters = async function getRosters(teamIds) {
  let rosters = []
  for (id of teamIds) {
    let options = {
      host: "statsapi.web.nhl.com",
      path: '/api/v1/teams/' + String(id.id) + '/?expand=team.roster&season=20182019',
      method: 'GET'
    }
    let callPromise = await helpers.callGenerator(options)
    let callResult = callPromise
    //rosters.push(callResult)
    let filteredResult = helpers.responseFilter(callResult, 'getRosters')
    // rosters.push(filteredResult)
    let newRoster = helpers.dataProcessing(filteredResult, 'getRosters', '20182019')
    rosters.push(newRoster)
  }
  return rosters
}
exports.getStats = async function getStats(players) {
  let stats = []
   for (team of players) {
   for (pl of team) {
    let options = {
      host: "statsapi.web.nhl.com",
   //  path: '/api/v1/people/8473544/stats?stats=statsSingleSeason&season=20182019',
      path: '/api/v1/people/' + String(pl.NHLId) + '/stats?stats=statsSingleSeason&season=20182019',
      method: 'GET'
    }
     let callPromise = await helpers.callGenerator(options)
     let callResult = {stats: callPromise, player: pl}
     let filteredResult = helpers.responseFilter(callResult,'getStats')
     let newPlayerStats = helpers.dataProcessing(filteredResult, 'getStats')
     stats.push(newPlayerStats)
   }
 }
 let playerStats = stats.filter((value,index,array) => {
  // console.log('null player')
   //console.log(value)
   return value
 })
  return playerStats
}

exports.writePlayers = async function(sentPlayers) {
  let savedPlayers = []
  for (pl of sentPlayers) {
   const savedPlayerPromise = await pl.save().catch((error) => {
   })
   const savedPlayer = savedPlayerPromise
    savedPlayers.push(savedPlayer)
  }
  return savedPlayers
}