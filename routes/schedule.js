const express = require('express')
const models = require('../models')
const { timeUnwrap, timeWrap } = require('../utils/timeparser')
const { requestNewVote, testVote } = require('../utils/when2meet')
const router = express.Router()


router.get('/test', async (req, res) => {
    //let a=timeUnwrap("월-목:12-13")
    let a=timeUnwrap("월-목:12-1", true)
    //console.log(a)
    let k = await requestNewVote("helllo", a.date, a.time[0], a.time[1])
    //let k = await testVote();
    res.send(k)
})

module.exports = router