const express = require('express')
const webhook_router = require('./webhook')
const router = express.Router()

router.get('/', async (req, res) => {
    res.send("Hello world api!!")
})

//router.use('/todo', todo_router)
//router.use('/user', null)
//router.use('/schedule', schedule_router)
router.use('/webhook', webhook_router)



module.exports = router