import express from 'express'
import todo_router from './todo.js'
export const router = express.Router()

router.get('/', (req, res) => {
    res.send("Hello world api!!")
})

router.use('/todo', todo_router)

export default router