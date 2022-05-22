const schedule = require("./schedule");
const { origin } = require("./when2meet");
const { CHANNEL_BOT_NAME, CHANNEL_API_KEY, CHANNEL_API_SECRET } = process.env
const JSONHEADER = { accept: "application/json", "Content-Type": "application/json" }
const fetch = require('node-fetch');
const { reminderUnwrap } = require("./timeparser");

const mentionWrapper = x => {
    const s = x.split(":")
    const uid = (s.length === 2 ? s[1] : "")
    return `<link type="manager" value="${uid}">@${s[0]}</link>`
}

const cht = {};
cht.commandHandler = {
    async createVote(args, rawtext) {
        if (args.length < 2) throw "인자 수가 너무 적습니다!"
        const timeslot = args[0]
        const name = args[1]
        const voter = []
        for (let i = 2; i < args.length; i++) {
            if (args[i][0] === '@') {
                const reg = new RegExp(`<link type="manager" value="(\\d+)">${args[i]}</link>`)
                const match = rawtext.match(reg)
                voter.push(args[i].substring(1) + (match ? (":" + match[1]) : ""))
            }
        }
        if (!timeslot || !name) throw "입력한 값을 다시 확인해 주세요"
        // args[3...]: 
        const vid = await schedule.createVote(voter, timeslot, name)
        const url = `${origin}?${vid}`
        return `[${name}] 일정이 생성되었습니다! 아래 링크에서 확인하시거나, !투표 명령어를 통해 바로 투표해 보세요\n<link type="url" value="${url}">${url}</link>`

    },
    async doVote(args, username) {
        const timeslot = args.join(" ")
        const { name } = await schedule.doVote(timeslot, username)
        return `[${name}] <b>${timeslot}</b>에 ${username}님 일정 체크 완료!`
    },
    async confirmVote(args, aux) {
        // TODO: add reminder
        if (args.length === 0) throw "인자 개수가 부족합니다!"
        const curr = await schedule.currentVote()
        const new_curr = await schedule.currentVote()
        const voter = curr.participants
        const mkres = await cht.reminderHandler.makeReminder([curr.name, ...args], aux, voter.length ? voter.split(",") : null)
        await schedule.deleteVote(curr.name)
        return `${curr.name} 일정조사가 확정되었습니다.\n[${curr.name} -> ${new_curr.name}] 현재 투표중인 일정이 변경되었습니다.\n` + mkres

    },
    async cancelVote(args) {
        if (!args[0]) throw "이름을 입력해 주세요!"
        await schedule.deleteVote(args[0])
        const curr = await schedule.currentVote()
        return `${args[0]} 투표가 취소되었습니다\n[${curr.name}] 현재 투표중인 일정입니다.`
    },
    async alertVote() {
        const curr = await schedule.currentVote()
        const url = `${origin}?${curr.vid}`
        const voter = await schedule.getParticipant()
        return `[${curr.name}] 투표 부탁드립니다! ${voter[1].map(x => mentionWrapper(x)).join(" ")}\n<link type="url" value="${url}">${url}</link>`
    },
    async listVote() {
        const curr = await schedule.currentVote()
        const votes = await schedule.listVote()
        const str = votes.map(x => `[${curr.name == x.name ? '<b>' + x.name + '</b>' : x.name}] <link type="url" value="${origin}?${x.vid}">${origin}?${x.vid}</link>`).join('\n')
        return str
    },
    async checkoutVote(args) {
        if (!args[0]) throw "이름을 입력해 주세요!"
        const curr = await schedule.currentVote()
        const next = await schedule.getVote(args[0])
        return `[${curr.name} -> ${next.name}] 현재 진행중인 투표 전환이 완료되었습니다.`
    },
    async currentVote() {
        const curr = await schedule.currentVote()
        const url = `${origin}?${curr.vid}`
        const voter = await schedule.getParticipant()
        const addr = voter[0].length !== 0 ? `\n${voter[0].map(x => x.split(":"[0])).join(", ")}님이 투표해주셨습니다` : ''
        return `[${curr.name}] 현재 투표중인 일정입니다: ${curr.schedule_string}\n<link type="url" value="${url}">${url}</link>${addr}`
    },
}

cht.reminderHandler = {
    async makeReminder(args, aux, additional_voter) {
        const rawtext = aux.rawtext
        const group_id = aux.group_id

        if (args.length < 2) throw "인자가 부족합니다!"
        const name = args[0]
        const voter = additional_voter ? [...additional_voter] : []
        const timestr = args.slice(1).join(" ").replace(/\s@(\S+)/g, '').trim()

        const regex_str = `(?:<link type="manager" value="(\\d+)">@(\\S+)<\/link>|\\s@(\\S+))`
        const links = rawtext.match(new RegExp(regex_str, 'g'))
        if (links) for (let link of links) {
            const d = link.match(new RegExp(regex_str))
            if (d[1]) voter.push(d[2] + ":" + d[1])
            else if (d[3]) voter.push(d[3])
        }

        if (!timestr || !name) throw "입력한 값을 다시 확인해 주세요"
        const times = reminderUnwrap(timestr)[1] // do validate + get remain time
        await schedule.makeReminder(name, voter, timestr, group_id)

        return `[${name}] 리마인더가 생성되었습니다. ${times.join(", ")} 전에 알려드립니다.`
    },
    async doReminder(args) {
        if (!args[0]) throw "이름을 입력해 주세요!"
        const elem = await schedule.findReminder(args[0])
        const voter = elem.participants.split(",")
        return `[${elem.name}] 리마인더 알림입니다. ${voter.map(x => mentionWrapper(x)).join(" ")}`
    },
    async removeRemider(args) {
        if (!args[0]) throw "이름을 입력해 주세요!"
        await schedule.removeReminder(args[0])
        return `[${args[0]}] 리마인더가 삭제되었습니다.`
    },
    async listReminder() {
        const elems = await schedule.listReminder();
        return elems.map(x => `[<b>${x.name}</b>] ${x.schedule_string} \n참여자: ${x.participants.split(",").map(x => x.split(":")[0]).join(", ")}`).join("\n")
    }
}

cht.util = {
    sendMessage: async (group_id, mes) => {
        const b = await fetch(`https://api.channel.io/open/v3/groups/${group_id}/messages?botName=${CHANNEL_BOT_NAME}`, {
            "headers": { ...JSONHEADER, "x-access-key": CHANNEL_API_KEY, "x-access-secret": CHANNEL_API_SECRET },
            "method": "POST",
            "body": JSON.stringify(cht.util.serializeOutput(mes))
        })
        const res = await b.json()
        if (b.status !== 200) throw res
    },
    quickReply: (res, out) => {
        res.set({ ...JSONHEADER, "x-quick-reply": "true", "x-bot-name": CHANNEL_BOT_NAME }).json(cht.util.serializeOutput(out))
    },
    serializeOutput: (out) => {
        return {
            "blocks": (typeof out === 'string') ? out.split("|").map(x => {
                x = x.trim()
                if (x.slice(0, 2) === ">>") return { "type": "code", "value": x.slice(2, x.length) }
                return { "type": "text", "value": x }
            }) : out,
        }
    },
    mentionWrapper,
}

module.exports = cht;