const express = require('express')
const todo_router = require('./todo')
const schedule_router = require('./schedule')
const webhook_router = require('./webhook')
const cht = require('../utils/channeltalk')
const schedule = require('../utils/schedule')
const router = express.Router()

router.get('/', async (req, res) => {
    console.log(await schedule.removeReminder("안녕"))
    res.send("Hello world api!!")
})

router.use('/todo', todo_router)

//router.use('/user', null)
router.use('/schedule', schedule_router)
router.use('/webhook', webhook_router)



module.exports = router