const express = require('express')
const models = require('../models')
const router = express.Router()

router.post('/', (req, res) => {
    models.Todo.create(req.body)
    res.sendStatus(200)
})

router.put('/:id', async (req, res) => {
    const todo = await models.Todo.findOne({where: {id: req.params.id}})
    if(todo) await todo.update(req.body)
    res.sendStatus(200)
})

router.delete('/:id', async (req, res) => {
    await models.Todo.destroy({where: {id: req.params.id}})
    res.sendStatus(200)
})

router.get('/:id', async (req, res) => {
    const data = await models.Todo.findOne({where: {id: req.params.id}})
    res.json(data)
})

router.get('/', async (req, res) => {
    const data = await models.Todo.findAll({raw: true})
    res.json(data)
})

module.exports = router