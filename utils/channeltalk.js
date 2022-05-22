const { default: axios } = require("axios");
const schedule = require("./schedule");
const { origin } = require("./when2meet");

const mentionWrapper = x => {
    const s = x.split(":")
    const uid = (s.length === 2 ? s[1] : "")
    console.log(s[0], uid)
    return `<link type="manager" value="${uid}">@${s[0]}</link>`
}

const cht = {};
cht.commandHandler = {
    async createVote(args, rawtext) {
        if (args.length < 3) throw "인자 수가 너무 적습니다!"
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
        if (!timeslot || !name || voter.length === 0) throw "입력한 값을 다시 확인해 주세요"
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
    async confirmVote() {
        // TODO: add reminder
    },
    async cancelVote(args) {
        if (!args[0]) throw "이름을 입력해 주세요!"
        await schedule.deleteVote(args[0])
        const curr = await schedule.currentVote()
        if (!curr) return "남은 일정이 없습니다!"
        return `${args[0]} 투표가 취소되었습니다\n[${curr.name}] 현재 투표중인 일정입니다`
    },
    async alertVote() {
        const curr = await schedule.currentVote()
        const url = `${origin}?${curr.vid}`
        const voter = await schedule.getParticipant()
        //TODO: add mention
        return `[${curr.name}] 투표 부탁드립니다! ${voter[1].map(x => mentionWrapper(x)).join(" ")}\n<link type="url" value="${url}">${url}</link>`
    },
    async listVote() {
        const votes = await schedule.listVote()
        const curr = await schedule.currentVote()
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
        if (!curr) return "현재 진행중인 일정 투표가 없습니다!"
        const url = `${origin}?${curr.vid}`
        const voter = await schedule.getParticipant()
        const addr = voter[0].length !== 0 ? `\n${voter[0].map(x => x.split(":"[0])).join(", ")}님이 투표해주셨습니다` : ''
        return `[${curr.name}] 현재 투표중인 일정입니다: ${curr.schedule_string}\n<link type="url" value="${url}">${url}</link>${addr}`
    },
    async remind() {

    }
}

cht.hello = (res) => "hello world! " + res;
cht.sendMessage = (message) => {
    /*     axios.post(`https://api.channel.io/open/v3/groups/${GROUP_ID}/messages?botName=${BOT_NAME}`, {
            "blocks": [
                {
                  "type": "text",
                  "value": message
                },
            ]
        }) */
}



module.exports = cht;