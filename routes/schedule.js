const express = require('express')
const models = require('../models')
const { unwrap, wrap } = require('../utils/timeparser')
const router = express.Router()


router.get('/test', (req, res) => {
    let a=(unwrap("월-화:12-15, 화:13, 수-목:23-3"))
    if(a) console.log(wrap(a))

    res.send('ok')
})

module.exports = router