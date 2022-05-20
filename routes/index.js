const express = require('express')
const todo_router = require('./todo')
const router = express.Router()

router.get('/', (req, res) => {
    res.send("Hello world api!!")
})

router.use('/todo', todo_router)

//router.use('/user', null)
//router.use('/bus', bus_router)


module.exports = router