const https = require('https')
//const Player = require('../../models/player')
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
    rosters.push(filteredResult)
    // let newRoster = helpers.dataProcessing(filteredResult, 'getRosters')
    // rosters.push(newRoster)
  }
  // let options = {
  //   host: "statsapi.web.nhl.com",
  //   path: '/api/v1/teams/' + String(id) + '/?expand=team.roster&season=20182019',
  //   method: 'GET'
  // }
  //let callPromise = await helpers.callGenerator(options)
  // let callResult = callPromise
  // let filteredResult = helpers.responseFilter(callResult, 'getRosters')
  // let rosters = helpers.dataProcessing(filteredResult)
  return rosters
}