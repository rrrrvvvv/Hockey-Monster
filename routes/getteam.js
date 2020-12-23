const express = require('express')
const router = express.Router()
const getTeamCtrl = require('../controllers/getteam')

// router.use(express.static('scripts/getranks'))
// router.get('/weighted', getRanksCtrl.weighted)
// router.get('/rankings', getRanksCtrl.rankings)
// router.get('/data', getRanksCtrl.data)
// router.use(express.static('scripts/getranks'))
router.post('/', getTeamCtrl.team)
router.post('/getaccesstoken', getTeamCtrl.getAccessToken)

module.exports = router