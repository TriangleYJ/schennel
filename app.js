const express = require('express')
const router = require('./routes/index')
const { getDateTimeFromDataTime } = require('./utils/timeparser')
const app = express()


const port = process.env.PORT | 8000

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(express.static('public'))
app.use('/api', router)

console.log()

app.listen(port, () => {
    console.log(`Server is listening from ${port}`)
})
