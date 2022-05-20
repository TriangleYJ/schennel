const fetch = require('node-fetch')

const when2meet = {
    async requestNewVote(name, possibleDate, noEarlierThan, noLaterThan) {
        //console.log(`NewEventName=${encodeURI(name)}&DateTypes=DaysOfTheWeek&PossibleDates=${encodeURI(possibleDate)}&NoEarlierThan=${noEarlierThan}&NoLaterThan=${noLaterThan}&TimeZone=Asia%2FSeoul`)
        const raw = await fetch("https://www.when2meet.com/SaveNewEvent.php", {
            "headers": {
                "Referer": "https://www.when2meet.com/",
                "content-type": "application/x-www-form-urlencoded",
            },
            "body": `NewEventName=${encodeURI(name)}&DateTypes=DaysOfTheWeek&PossibleDates=${encodeURI(possibleDate)}&NoEarlierThan=${noEarlierThan}&NoLaterThan=${noLaterThan}&TimeZone=Asia%2FSeoul`,
            "method": "POST"
        })
        const res = await raw.text()
        const vid = res.match(/window.location='(.+)'/)[1]
        console.log(vid)
        return vid
    },
}

module.exports = when2meet