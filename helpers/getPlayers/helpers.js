const https = require('https')
const Player = require('../../models/player')

exports.callGenerator = function callGenerator(options) {
    console.log('hello from call generator')
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

const filterResults = function filterResults(data, location) {

}

const dataProcessing = function dataProcessing(data, location) {

}

exports.filterResults = filterResults
exports.dataProcessing = dataProcessing