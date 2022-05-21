const fetch = require('node-fetch')
const ORIGIN = 'https://www.when2meet.com/'
const HEADER = {
    "Referer": ORIGIN,
    "content-type": 'application/x-www-form-urlencoded',
}
const cheerio = require('cheerio')
const { enday2num } = require('./timeparser')

const when2meet = {
    async requestNewVote(name, possibleDate, noEarlierThan, noLaterThan) {
        //console.log(`NewEventName=${encodeURI(name)}&DateTypes=DaysOfTheWeek&PossibleDates=${encodeURI(possibleDate)}&NoEarlierThan=${noEarlierThan}&NoLaterThan=${noLaterThan}&TimeZone=Asia%2FSeoul`)
        const raw = await fetch(`${ORIGIN}SaveNewEvent.php`, {
            "headers": HEADER,
            "body": `NewEventName=${encodeURI(name)}&DateTypes=DaysOfTheWeek&PossibleDates=${encodeURI(possibleDate)}&NoEarlierThan=${noEarlierThan}&NoLaterThan=${noLaterThan}&TimeZone=Asia%2FSeoul`,
            "method": "POST"
        })
        const res = await raw.text()
        const vid = res.match(/window.location='(.+)'/)[1]
        console.log(vid)
        return vid.slice(2, vid.length)
    },
    async requestDoVote(name, vid, avail) {
        const ivid = vid.split("-")[0]
        const raw = await fetch(`${ORIGIN}ProcessLogin.php`, {
            "headers": HEADER,
            "body": `id=${ivid}&name=${name}&password=&_=`,
            "method": "POST"
        })
        const pid = await raw.text()
        const raw2 = await fetch(`${ORIGIN}SaveTimes.php`, {
            "headers": HEADER,
            "method": "POST",
            "body": `person=${pid}&event=${ivid}&availability=${avail}&_=`,
        })
        return await raw2.text()
    },
    async requestGetContent(vid) {
        console.log(`${ORIGIN}${vid}`);
        const raw = await fetch(`${ORIGIN}?${vid}`, {
            "headers": HEADER,
            "method": "GET"
        })
        const res = await raw.text()
        //console.log(res)
        return res
    },
    async requestGetDetail(vid) {
        const raw = await fetch(`${ORIGIN}?${vid}`, {
            "headers": HEADER,
            "method": "GET"
        })
        const k = await raw.text()
        const $ = cheerio.load(k)
        const participant = []
        const participantId = []
        const timeOfSlot = {}
        const names = k.match(/PeopleNames\[(\d+)\] = '(\w+)'/g)
        if (names) for (let name of names) {
            const d = name.match(/PeopleNames\[(\d+)\] = '(\w+)'/)
            participant[parseInt(d[1])] = d[2]
        }
        const namesId = k.match(/PeopleIDs\[(\d+)\] = (\d+)/g)
        if (namesId) for (let name of namesId) {
            const d = name.match(/PeopleIDs\[(\d+)\] = (\d+)/)
            participantId[parseInt(d[1])] = parseInt(d[2])
        }
        const toses = k.match(/TimeOfSlot\[(\d+)\]=(\d+)/g)
        if (toses) for (let name of toses) {
            const d = name.match(/TimeOfSlot\[(\d+)\]=(\d+)/)
            timeOfSlot[d[2]] = {
                idx: parseInt(d[1]),
                time: null
            }

        }

        const adjAPM = (i, s) => {
            if (i === 12 && s === "AM") return 0
            if (i === 12 && s === "PM") return 12
            return i + ((s === "PM") ? 12 : 0)
        }

        $("#GroupGridSlots").map((i, row) => {
            if (row) $(row).find('div').map((j, elem) => {
                let rawtext = $(elem).attr("onmouseover")
                if (rawtext && rawtext !== "ShowSlot(0);") {
                    const showmatch = rawtext.match(/ShowSlot\((\d+),"(\w+) (\d+):(\d+):(\d+) (\w+)"\);/)
                    if (showmatch) {
                        timeOfSlot[showmatch[1]]["time"] = {
                            day: enday2num(showmatch[2]),
                            hour: adjAPM(parseInt(showmatch[3]), showmatch[6]),

                        }
                    }
                }
            })
        })

        return {
            participant, participantId, timeOfSlot
        }
    },

}

module.exports = when2meet