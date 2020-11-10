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

const Player = require('../models/weightedPlayers')
const mongoose = require('mongoose')

exports.rankings = (req, res, next) => {
    console.log('hello from rankings')
    // res.setHeader("Content-Type", "text/html")
    // res.render('rankings')
    //  next()

    //this should get and serve the data from the database
    //it willlbe incorporated into the D3 chart in the client.


    // response should included an array of data with labels
    // async function getPlayerData() {
    //     let data = [1,2,3,4]
        try {
            res.status(201).render('rankings')
        } catch (error) {
            console.log
            res.status(404).json({error:error})
        }

//     }

//     getPlayerData()
 }

 exports.data = async (req,res,next) => {
     console.log('hello from data')
     try{
         const dataPromise = await Player.find({},['name','goals'])
         const data = dataPromise
        // res.status(201).json(JSON.stringify(data))
        res.status(201).json(data)
     } catch (error) {
        res.status(404).json({error:error})
     }
 }