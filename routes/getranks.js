const express = require('express')
const router = express.Router()
const getRanksCtrl = require('../controllers/getranks')

router.use(express.static('scripts/getranks'))
// router.get('/weighted', getRanksCtrl.weighted)
router.get('/rankings', getRanksCtrl.rankings)
router.get('/data', getRanksCtrl.data)
// router.use(express.static('scripts/getranks'))

module.exports = router