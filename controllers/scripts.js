exports.populatePlayers = (req,res,next) => {
    console.log('hello')
    res.status(201).jsonp({
        message: 'hello'
    })
} 