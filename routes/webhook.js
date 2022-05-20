const express = require('express')
const models = require('../models')
const router = express.Router()
router.post('/webhook', (req, res) => {
    const token = req.query.token
    const body = req.body
})

module.exports = router