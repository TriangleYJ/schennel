import express from 'express'
import router from './routes/index.js'
const app = express()

const port = process.env.PORT | 8000

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(express.static('public'))
app.use('/api', router)

app.listen(port, () => {
    console.log(`Server is listening from ${port}`)
})
