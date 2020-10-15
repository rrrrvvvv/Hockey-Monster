const https = require('https')


exports.getPlayerIds = (req, res, next) => {
    let options = {
        host: "statsapi.web.nhl.com",
        path: '/api/v1/teams',
        method: 'GET'
        // secureProtocol: 'TLSv1_method'
    }

    const request = https.request(options, (response) => {

        let rawData = ''

        response.on('error', (error) => {
            console.log(error)
            res.status(404).json({
                error: error
            })
        })

        response.on('data', (data) => {
            rawData += data
        })

        response.on('end', () => {
            try {
                const parsedData = JSON.parse(rawData)
                console.log(parsedData)
                res.status(201).json({
                    message: 'hello'
                })
            }
            catch(error){
                console.log(error)
                res.status(404).json({
                    error: error
                })
            }
        })



    })

    request.end()


    // request.on('error', (error) => {
    //     console.log(error)
    //     res.status(404).json({
    //         error: error
    //     })
    // })

    // request.on('end', () => {
    //     try {
    //         res.status(201).json({
    //             message: 'hello'
    //         })
    //     } catch (error) {
    //         res.status(404).json({
    //             error: error
    //         })
    //     }
    // })

    // request.end()

    // request.end(() => {
    //     res.status(201).json({
    //         message: 'hello',
    //     })
    // })

    // console.log('hello')
    // let test = new Promise((resolve, reject) => {
    //     const apiGetTeamIds = new XMLHttpRequest()
    //     const teamIds = []
    //     apiGetTeamIds.open('GET', 'https://statsapi.web.nhl.com/api/v1/teams')
    //     apiGetTeamIds.onreadystatechange = function () {
    //         if (apiGetTeamIds.readyState === 4) {
    //             const response = JSON.parse(apiGetTeamIds.response)
    //             for (team of response.teams) {

    //                 teamIds.push(team.id)
    //             }

    //             resolve(teamIds)

    //         }
    //     }
    //     apiGetTeamIds.send()

    // })
    // console.log(test)
    // res.status(201).jsonp({
    //     message: 'hello'
    // })
}




// http.get('http://nodejs.org/dist/index.json', (res) => {
//     const {
//         statusCode
//     } = res;
//     const contentType = res.headers['content-type'];

//     let error;
//     // Any 2xx status code signals a successful response but
//     // here we're only checking for 200.
//     if (statusCode !== 200) {
//         error = new Error('Request Failed.\n' +
//             `Status Code: ${statusCode}`);
//     } else if (!/^application\/json/.test(contentType)) {
//         error = new Error('Invalid content-type.\n' +
//             `Expected application/json but received ${contentType}`);
//     }
//     if (error) {
//         console.error(error.message);
//         // Consume response data to free up memory
//         res.resume();
//         return;
//     }

//     res.setEncoding('utf8');
//     let rawData = '';
//     res.on('data', (chunk) => {
//         rawData += chunk;
//     });
//     res.on('end', () => {
//         try {
//             const parsedData = JSON.parse(rawData);
//             console.log(parsedData);
//         } catch (e) {
//             console.error(e.message);
//         }
//     });
// }).on('error', (e) => {
//     console.error(`Got error: ${e.message}`);
// });