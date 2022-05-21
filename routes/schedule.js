const express = require('express')
const { Vote } = require('../models')
const { timeUnwrap, timeWrap, timeToAvailability } = require('../utils/timeparser')
const { requestNewVote, requestDoVote, requestGetContent, requestGetDetail } = require('../utils/when2meet')
const router = express.Router()
const cheerio = require('cheerio')


// 15726999-mp7pR
const getRecentVote = async () => {
    if (await Vote.count() === 0) return null;
    return await Vote.findOne({ order: [['updatedAt', 'DESC']], })
}


router.get('/createVote', async (req, res) => {
    const nessaryVoter = ["triangle", "hello", "wow"]
    const timestring = "월-금:12-15"
    const name = "helloworld4"

    try {
        if (!timestring || !name) throw "empty timestring or name"
        let a = timeUnwrap(timestring, true)
        if (a === null) throw "time syntax error"
        const elem = await Vote.create({
            vid: null,
            name: name,
            participants: nessaryVoter.toString(),
            schedule_string: timestring,
        })
        const k = await requestNewVote(name, a.date, a.time[0], a.time[1])
        elem.vid = k
        await elem.save()
        res.send(k)
    } catch (e) {
        console.log(e)
        res.status(500).send(e);
    }
})

router.get('/doVote', async (req, res) => {
    const timestring = "수-목:13-14"
    const user = "fdas"

    try {
        const elem = await getRecentVote();
        if (!elem) throw "no vote data"
        let k = await requestGetDetail(elem.vid)
        let u = timeUnwrap(timestring)
        await requestDoVote(user, elem.vid, timeToAvailability(k.timeOfSlot, u))
        res.send("ok")
    } catch (e) {
        console.log(e)
        res.status(500).send(e);
    }
})

router.get('/getStatus', async (req, res) => {
    try {
        const elem = await getRecentVote();
        if (!elem) throw "no vote data"

        let k = await requestGetDetail(elem.vid)
        const all = await Vote.findAll()
        all.map(x => {
            console.log(x.id, x.vid, x.name)
        })
        res.send(k)
    } catch (e) {
        console.log(e)
        res.status(500).send(e);
    }
})

router.get('/getParticipant', async (req, res) => {
    try {
        const elem = await getRecentVote()
        if (!elem) throw "no vote data"
        const nessaryVoter = elem.participants.split(",")

        let k = await requestGetDetail(elem.vid)
        let voter = k.participant;
        let p = nessaryVoter.filter(x => !k.participant.includes(x))
        res.send([voter, p])
    } catch (e) {
        console.log(e)
        res.status(500).send(e);
    }
})

router.get('/getVote', async (req, res) => {
    const name = "helloworld"

    try {
        const elem = await Vote.findOne({ where: { name: name } })
        if (!elem) throw "vote not found"
        elem.changed('updatedAt', true)
        await elem.save()
        res.sendStatus(200)
    } catch (e) {
        console.log(e)
        res.status(500).send(e);
    }
})

router.get('/deleteVote', async (req, res) => {
    const name = "helloworld1"

    try {
        await Vote.destroy({ where: { name: name } })
        res.sendStatus(200)
    } catch (e) {
        console.log(e)
        res.status(500).send(e);
    }
})

/* router.get('/gc', async (req, res) => {
    const vid = "15726999-mp7pR"

    let k = await requestGetContent(vid)
    const $ = cheerio.load(k)
    const table = $("#GroupGrid").html()
    nodeHtmlToImage({
        output: './image.png',
        html: `<html><body>${table}</body></html>`
    })
    res.send(table)
}) */
module.exports = router