const express = require('express')
const router = express.Router()

const scriptsCtrl = require("../controllers/scripts")

router.get('/', scriptsCtrl.getPlayerIds)


module.exports = router