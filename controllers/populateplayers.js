const https = require('https')

exports.renderView = (req,res,next) => {
    res.render('index')
    next()
}