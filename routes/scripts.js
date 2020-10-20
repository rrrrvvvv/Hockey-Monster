const express = require('express')
const router = express.Router()

const scriptsCtrl = require("../controllers/scripts")

router.get('/', scriptsCtrl.getPlayers)
router.get('/rank', scriptsCtrl.getRanks)
//router.get('/', scriptsCtrl.getTeamRosters)


module.exports = router