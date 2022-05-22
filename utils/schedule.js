const { Vote, Reminder } = require('../models')
const { timeUnwrap, timeToAvailability, reminderUnwrap } = require('../utils/timeparser')
const { requestNewVote, requestDoVote, requestGetContent, requestGetDetail } = require('../utils/when2meet')
const nodeSchedule = require('node-schedule')
const schedule = {}

const getRecentVote = async () => {
    if (await Vote.count() === 0) throw "현재 진행중인 일정 투표가 없습니다!"
    return await Vote.findOne({ order: [['updatedAt', 'DESC']], })
}


schedule.createVote = async (nessaryVoter, timestring, name) => {
    // const nessaryVoter = ["triangle", "hello", "wow"]
    // const timestring = "월-금:12-15"
    // const name = "helloworld4"

    if (!timestring || !name) throw "empty timestring or name"
    let a = timeUnwrap(timestring, true)
    if (a === null) throw "time syntax error"
    const elem = await Vote.create({
        vid: null,
        name: name,
        participants: nessaryVoter.toString(),
        schedule_string: timestring
    })
    const k = await requestNewVote(name, a.date, a.time[0], a.time[1])
    elem.vid = k
    await elem.save()
    return k
}

schedule.currentVote = async () => {
    return await getRecentVote()
}

schedule.doVote = async (timestring, user) => {
    // const timestring = "수-목:13-14"
    // const user = "fdas"

    const elem = await getRecentVote();
    let k = await requestGetDetail(elem.vid)
    let u = timeUnwrap(timestring)
    if (u === null) throw "time syntax error"
    await requestDoVote(user, elem.vid, timeToAvailability(k.timeOfSlot, u))
    return elem
}

schedule.getStatus = async () => {
    const elem = await getRecentVote();

    let k = await requestGetDetail(elem.vid)
    const all = await Vote.findAll()
    all.map(x => {
        console.log(x.id, x.vid, x.name)
    })
    return k
}

schedule.getParticipant = async () => {
    const elem = await getRecentVote()
    const nessaryVoter = elem.participants.split(",")

    let k = await requestGetDetail(elem.vid)
    let voter = k.participant;
    let p = nessaryVoter.filter(x => !k.participant.includes(x.split(":")[0]))
    return [voter, p]
}

schedule.getVote = async (name) => {
    // const name = "helloworld"

    const elem = await Vote.findOne({ where: { name: name } })
    if (!elem) throw "해당 이름을 찾을 수 없습니다!"
    elem.changed('updatedAt', true)
    await elem.save()
    return elem
}

schedule.deleteVote = async (name) => {
    await Vote.destroy({ where: { name: name } })
    return true
}

schedule.listVote = async () => {
    const all = await Vote.findAll({ raw: true })
    return all
}

schedule.makeReminder = async (name, participants, schedule_string, group_id) => {
    const data = { name, participants: participants.join(","), schedule_string, group_id }
    const foundItem = await Reminder.findOne({ where: { name: name } })
    if (foundItem) await schedule.removeReminder(name)
    const elem = await Reminder.create(data)
    schedule.registerReminder(elem)
    return true
}

schedule.findReminder = async (name) => {
    const elem = await Reminder.findOne({ where: { name: name } })
    if (!elem) throw "해당 이름의 리마인더를 찾지 못했습니다!"
    return elem
    //return true: TODO node-schedule
}

schedule.removeReminder = async (name) => {
    const elem = await Reminder.findOne({ where: { name: name } })
    const dd = reminderUnwrap(elem.schedule_string)
    for (let before of dd[1]) {
        const uid = elem.name + "@" + before
        if (nodeSchedule.scheduledJobs[uid]){
            console.log("스케줄러 삭제", uid)
            nodeSchedule.scheduledJobs[uid].cancel()  
        } 
    }
    await Reminder.destroy({ where: { name: name } })
    return true
}

schedule.listReminder = async () => {
    const data = await Reminder.findAll()
    return data
}

schedule.initReminder = async () => {
    const elems = await Reminder.findAll()
    for (let elem of elems) {
        schedule.registerReminder(elem)
    }
}

schedule.registerReminder = async (elem) => {
    const { sendMessage, mentionWrapper } = require('./channeltalk').util
    let used = false
    try {
        const dd = reminderUnwrap(elem.schedule_string)
        for (let before of dd[1]) {
            const blast = before[before.length - 1]
            //console.log(dd, parseInt(before.substring(0, before.length - 1)), blast)
            const reminderT = new Date(dd[0]).getTime() - (parseInt(before.substring(0, before.length - 1)) * (blast === "시" ? 3600000 : 60000))
            if (reminderT > new Date().getTime()) {
                used = true
                const uid = elem.name + "@" + before
                //console.log("스케줄러 후보", uid)
                if (nodeSchedule.scheduledJobs[uid] === undefined) {
                    const objDate = new Date(reminderT)
                    const voter = elem.participants.split(",")
                    console.log("스케줄러 등록", uid, objDate)
                    nodeSchedule.scheduleJob(uid, objDate, () => {
                        console.log("스케줄러 알림", uid, objDate)
                        sendMessage(elem.group_id, `[${elem.name}] ${before}전 리마인더 알림입니다. ${voter.map(x => mentionWrapper(x)).join(" ")}`)
                        schedule.registerReminder(elem)
                    })
                }

            }
        }
        if (!used) await schedule.removeReminder(elem.name)
    } catch (e) {
        console.log(e)
        sendMessage(elem.group_id, "오류가 발생했습니다: " + e)
    }
}

/* schedule.get('/gc', async (req, res) => {
    const vid = "15726999-mp7pR"

    let k = await requestGetContent(vid)
    const $ = cheerio.load(k)
    const table = $("#GroupGrid").html()
    nodeHtmlToImage({
        output: './image.png',
        html: `<html><body>${table}</body></html>`
    })
    return table)
}) */
module.exports = schedule