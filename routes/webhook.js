const express = require('express')
const models = require('../models')
const { createVote, doVote, confirmVote, cancelVote, alertVote, currentVote, remind } = require('../utils/schedule')
const router = express.Router()
const JSONHEADER = { accept: "application/json", "Content-Type": "application/json" }
const botname = process.env.CHANNEL_BOT_NAME ?? 'bot'
const commands = {
    "!테스트": (args, userid) => `${userid}님의 새로운 메시지: ${args}`,
    "!테스트2": () => '',
    "!투표생성": createVote,
    "!투표": doVote,
    "!일정확정": confirmVote,
    "!투표취소": cancelVote,
    "!투표해주세요": alertVote,
    "!투표현황": currentVote,
    "!리마인더": remind,
}
router.post('/', (req, res) => {
    if (process.env.CHANNEL_BOT_TOKEN === req.query.token) {
        console.log(req.body)
        const { event, entity, refers } = req.body;
        const { plainText = '', personType = '', chatId: groupId } = entity;
        const segment = plainText.split(" ")
        const prefix = segment.shift()

        if (Object.keys(commands).includes(prefix)) {
            const username = refers.manager.name
            let out = commands[prefix](segment, username)
            try {
                out = commands[prefix](segment, username)
            } catch (e) {
                console.log(e)
                out = "Error " + e
            }
            if (out) {
                res.set({ ...JSONHEADER, "x-quick-reply": "true", "x-bot-name": botname }).json({
                    "blocks": [
                        {
                            "type": "text",
                            "value": out
                        },
                    ]
                })
                return;
            }
        }
        res.send("ok")
    } else res.sendStatus(401)
})

module.exports = router