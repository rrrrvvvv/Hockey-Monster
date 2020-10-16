const express = require('express')
const router = express.Router()

const populateplayersCtrl = require("../controllers/populateplayers")

router.get('/', populateplayersCtrl.renderView)


module.exports = router