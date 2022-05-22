const express = require('express')
const router = require('./routes/index')
const { getDateTimeFromDataTime } = require('./utils/timeparser')
const app = express()
const models = require("./models/index.js");
const schedule = require('./utils/schedule');
models.sequelize.sync(/* { alter: true } */).then(() => {
    console.log("DB 연결 성공");
}).catch(err => {
    console.log("연결 실패");
    console.log(err);
})


const port = process.env.PORT ?? 8000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static('public'))
app.use('/api', router)
schedule.initReminder();

app.listen(port, () => {
    console.log(`Server is listening from ${port}`)
})
