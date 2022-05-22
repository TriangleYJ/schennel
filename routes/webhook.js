const express = require('express')
const batch = require('../utils/commandlist')
const { quickReply } = require('../utils/channeltalk').util
const { commands } = require('../utils/commandlist')
const router = express.Router()

router.post('/', async (req, res) => {
    if (process.env.CHANNEL_BOT_TOKEN === req.query.token) {
        const body = req.body;
        const { entity, refers } = body;
        const { plainText = '', chatId: groupId } = entity;
        const args = plainText.split(" ")

        if (refers.manager && Object.keys(commands).includes(args[0])) {
            out = await (batch.runCommand(commands) (args, body))
            if (out) {
                quickReply(res, out)
                return;
            }
        }
        res.send("ok")
    } else res.sendStatus(401)
})

module.exports = router