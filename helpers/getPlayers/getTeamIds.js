const https = require('https')
//const Player = require('../../models/player')
const helpers = require('./helpers')

exports.getTeamIds = async function getTeamIds() {
    console.log('hello from getTeamIds')
  //  return new Promise((resolve,reject) => {
        let options = {
            host: "statsapi.web.nhl.com",
            path: '/api/v1/teams',
            method: 'GET'
        }
   //     try{

        
        let call = await helpers.callGenerator(options)
        return call
           // let callResult = call
          //  let filteredResult = responseFilter(callResult,'getTeamIds')
          //  let teamIdsArray = dataProcessing(filteredResult,'getTeamIds')
          //  resolve(teamIdsArray)
    //      resolve(call)
     // }
    //    catch(error){
         //resolve('callresult')
           // console.log(error + 'in getTeam Ids')
     //       reject(error)
      //  }
   // })
}