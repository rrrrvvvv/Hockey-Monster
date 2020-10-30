// exports.weighted = (req,res,next) => {
//     try {
//         console.log('hello from getranks controller')
//         res.render('rankings')

//         // res.status(201).json({
//         //     message: 'message'
//         // })
//     }
//     catch (error) { 
//         res.status(404).json({
//             error: error
//         })

//     }
// console.log('hello')
// }

// exports.weighted = (req, res, next) => {
//     console.log('hello from weighted')
//     res.redirect('rankings')
//     // next()
// }

exports.rankings = (req,res,next) => {
    console.log('hello from rankings')
    res.setHeader("Content-Type", "text/html")
    res.render('rankings')
}