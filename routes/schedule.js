const express = require('express')
const models = require('../models')
const { timeUnwrap, timeWrap, timeToAvailability } = require('../utils/timeparser')
const { requestNewVote, requestDoVote, requestGetContent, requestGetDetail } = require('../utils/when2meet')
const router = express.Router()



router.get('/createVote', async (req, res) => {
    //let a=timeUnwrap("월-목:12-13")
    if (!req.query.timestring || !req.query.name) {
        res.sendStatus(400);
    } else {
        let a = timeUnwrap(req.query.timestring, true)
        if (a !== null) {
            let k = await requestNewVote(req.query.name, a.date, a.time[0], a.time[1])
            res.send(k)
        } else res.sendStatus(400)
    }
})

router.get('/doVote', async (req, res) => {
    let k = await requestGetDetail("15726999-mp7pR")
    let u = timeUnwrap("월-일:1-23")
    await requestDoVote("tester", "15726999-mp7pR", timeToAvailability(k.timeOfSlot, u))
    res.send("ok")
})

router.get('/getStatus', async (req, res) => {
    let k = await requestGetDetail("15726999-mp7pR")
    res.send(k)
})
module.exports = router