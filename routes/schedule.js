const express = require('express')
const models = require('../models')
const { timeUnwrap, timeWrap } = require('../utils/timeparser')
const router = express.Router()


router.get('/test', (req, res) => {
    let a=(timeUnwrap("월-금:22-4", true))
    if(a) console.log(a)
    a=(timeUnwrap("수-목:23-0"))
    if(a) console.log(timeWrap(a))

    res.send('ok')
})

module.exports = router