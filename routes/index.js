const express = require('express')
const todo_router = require('./todo')
const schedule_router = require('./schedule')
const webhook_router = require('./webhook')
const router = express.Router()

router.get('/', (req, res) => {
    res.send("Hello world api!!")
})

router.use('/todo', todo_router)

//router.use('/user', null)
router.use('/schedule', schedule_router)
router.use('/webhook', webhook_router)


module.exports = router