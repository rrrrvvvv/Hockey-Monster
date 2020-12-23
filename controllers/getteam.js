// const bodyParser = require('body-parser')
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest

exports.team = (req, res, next) => {



    try {
        let params = {
            client_id: '--',
            client_Secret: '--',
            redirect_uri: "https://a8c5eb3cce6e.ngrok.io/getranks/rankings",
            response_type: "code"
        }

        let url = new URL('https://api.login.yahoo.com/oauth2/request_auth')
        url.searchParams.append("client_id", params.client_id)
        url.searchParams.append("redirect_uri", params.redirect_uri)
        url.searchParams.append("response_type", params.response_type)

        console.log('redirecting to:  \n' + url)
        // res.setHeader('Access-Control-Allow-Origin', 'https://67e47ae99ae1.ngrok.io')

        // res.redirect(url)
        res.status(201).json({
            message: "hello",
            url: url
        })

        function getAuthURL() {
            console.log("hello from get Auth URL")
            // let url = 'https://api.login.yahoo.com/oauth2/request_auth?client_id=' + client_id + '--&redirect_uri=oob&response_type=code&language=en-us'
            let url = new URL('https://api.login.yahoo.com/oauth2/request_auth')
            url.searchParams.append("client_id", params.client_id)
            url.searchParams.append("redirect_uri", params.redirect_uri)
            url.searchParams.append("response_type", params.response_type)
            // url += '?client_id=' + params.client_id
            console.log("the url is")
            console.log(url.href)
            return new Promise((resolve, reject) => {
                let request = new XMLHttpRequest()
                request.open('GET', url.href)
                request.onreadystatechange = () => {
                    if (request.readyState === 4) {
                        // console.log(request.response)
                        resolve(request.response)
                    } else {
                        reject(request.response)
                    }
                }
                request.send()
            })
        }

        async function sendAuthURL() {
            try {
                const requestPromise = getAuthURL()
                const response = await requestPromise
                console.log(response)
                res.status(201).json({
                    message: "hello"
                    // body: JSON.stringify(response.body)
                })

            } catch (error) {
                console.log("error is")
                console.log(error)
                res.status(404).json({
                    error: error
                })

            }

        }

        // sendAuthURL()




        // console.log("helloooo")
        // console.log(req.body)
        // let reply = JSON.stringify(req.body)
        // res.status(201).json({
        //     message: "hello",
        //     url: reply
        // })
    } catch (error) {
        // console.log
        res.status(404).json({
            error: error
        })
    }
}

exports.getAccessToken = (req, res, next) => {

    try {
        console.log("in getAccessToken")
        const code = req.body.code

        const params = {
            client_id: '--',
            client_Secret: '--',
            redirect_uri: "https://a8c5eb3cce6e.ngrok.io/getranks/rankings",
            code: code,
            grant_type: "authorization_code"
        }

        params.authHeader = "Basic " + Buffer.from(params.client_id + ":" + params.client_Secret).toString("base64")

        

        // function getCode() {
        //     const code = req.body.code
        //     // let url = new URL(params.redirect_uri)
        //     // url.searchParams.append("code", code)
        //     // console.log(code)
        //     return code
        // }

        console.log(params.code)
        console.log(params)

        function getToken() {
            console.log("in getToken")
            return new Promise((resolve, reject) => {
                let request = new XMLHttpRequest()
                let url = new URL('https://api.login.yahoo.com/oauth2/get_token')
                url.searchParams.append("client_id", params.client_id)
                url.searchParams.append("client_secret", params.client_secret)
                url.searchParams.append('redirect_uri',params.redirect_uri)
                url.searchParams.append('code',params.redirect_uri + params.code)
                url.searchParams.append('grant_type',params.grant_type)
                console.log(url.href)
                let body = "grant_Type=authorization_code&redirect_uri=" + params.redirect_uri + '&code=' + params.code
                request.open("POST", url)
                request.setRequestHeader("Authorization", params.authHeader)
                request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
                request.onreadystatechange = () => {
                    if (request.readyState === 4) {
                        if(request.status === 201) {
                        console.log(request.response)
                        resolve(request.response)
                        } else {
                            reject(request.response)
                        }
                    }
                    //  else {
                    // //     reject(request.response)
                    // //     console.log(request.response)
                    // // }
                }
                request.send(body)
            })
        }

        async function sendTokenRequest() {
            console.log("in sendTokenRequest")
            try {
                let tokenPromise = await getToken()
                let token = tokenPromise
                console.log(token)



                res.status(201).json({
                    hello: "hello",
                    token: token
                })

            } catch (error) {
                console.log("error is")
                console.log(error)
                res.status(404).json({
                    error: error
                })
            }
        }
        // console.log("hello from get AccessToken")
        // const code = req.body.code
        // console.log(code)
        //make call with the code

        sendTokenRequest()

        // res.status(201).json({
        //     hello: "hello"
        // })
    } catch (error) {
        res.status(404).json({
            error: error
        })
    }

    // console.log("hello from get AccessToken")
    // console.log(JSON.parse(req.body))
}