import express from 'express'
export const router = express.Router()

router.post('/', (req, res) => {
    console.log('post', req.body);
    res.sendStatus(200)
})

router.delete('/:id/delete', (req, res) => {
    console.log("delete", req.params.id, req.body)
    res.sendStatus(200)
})

router.get('/:id', (req, res) => {
    console.log("GET", req.params.id)
    res.json({
        id: 1,
        title: "title",
        subtitle: "subtitle",
        date: "2021-01-12"
    })
})

router.get('/', (req, res) => {
    res.json([{
        id: 1,
        title: "title",
        subtitle: "subtitle",
        date: "2021-01-12"
    }, {
        id: 2,
        title: "title2",
        subtitle: "subtitle2",
        date: "2021-01-13"
    }, {
        id: 3,
        title: "title3",
        subtitle: "subtitle333",
        date: "2021-01-11"
    }])
})

export default router