const express = require('express')
const router = express.Router()

const scriptsCtrl = require("../controllers/scripts")

router.get('/', scriptsCtrl.getTeamIds)
//router.get('/', scriptsCtrl.getTeamRosters)


module.exports = router