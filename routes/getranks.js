const express = require('express')
const router = express.Router()
const getRanksCtrl = require('../controllers/getranks')


// router.get('/weighted', getRanksCtrl.weighted)
router.get('/rankings', getRanksCtrl.rankings)

module.exports = router