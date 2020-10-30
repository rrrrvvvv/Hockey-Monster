const express = require('express')
const router = express.Router()
const homepageCtrl = require('../controllers/homepage')

// router.use(express.static('scripts/homepage'))
router.get('', homepageCtrl.renderView)
router.use(express.static('scripts/homepage'))
// router.get('/scripts/homepage', express.static("scripts"))
// router.use(express.static('scripts'))

module.exports = router