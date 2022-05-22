const express = require('express')
const { quickReply } = require('../utils/channeltalk').util
const { commands } = require('../utils/commandlist')
const router = express.Router()

router.post('/', async (req, res) => {
    if (process.env.CHANNEL_BOT_TOKEN === req.query.token) {
        const body = req.body;
        const { entity, refers } = body;
        const { plainText = '', chatId: groupId } = entity;
        const segment = plainText.split(" ")
        const prefix = segment.shift()

        if (refers.manager && Object.keys(commands).includes(prefix)) {
            let out = null;
            try {
                const auxf = commands[prefix]["aux"]
                out = await commands[prefix].func(segment, auxf ? auxf(body) : null)
            } catch (e) {
                console.log(e)
                out = "Error: " + e
            }
            if (out) {
                quickReply(res, out)
                return;
            }
        }
        res.send("ok")
    } else res.sendStatus(401)
})

module.exports = router