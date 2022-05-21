// timeslot = [0, 0, 0, 0, 0, 0, 0] // 0~2^48 <= Number.MAX_SAFE_INTEGER: bitmask
const TREGEX = /^([월화수목금토일])(?:-([월화수목금토일]))?:([01]\d|2[0123]|[0-9])(?:-([01]\d|2[0123]|[0-9]))?$/
const DSTRING = { '월': 1, '화': 2, '수': 3, '목': 4, '금': 5, '토': 6, '일': 0 }
const DSTRING_EN = { 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4, 'Friday': 5, 'Saturday': 6, 'Sunday': 0 }
const RDSTRING = "일월화수목금토"
//const BASETIME = 1373252400000 // new Date(2013, 6, 8, 12).getTime()

const parser = {
    timeUnwrap(string, newVoteStyle) {
        const split_string = string.split(",")
        const tmp_dstring = [0, 0, 0, 0, 0, 0, 0]
        let min_srt_time = null;
        let max_end_time = null;

        for (let str of split_string) {
            str = str.trim()
            if (!TREGEX.test(str)) return null;
            const match = str.match(TREGEX)
            let srt_date = DSTRING[match[1]]
            let end_date = match[2] ? DSTRING[match[2]] : DSTRING[match[1]]
            let srt_time = parseInt(match[3])
            let end_time = parseInt(match[4] ?? match[3])
            end_time += (srt_time > end_time) ? 24 : 0
            if (!max_end_time || end_time > max_end_time) max_end_time = end_time;
            if (!min_srt_time || srt_time < min_srt_time) min_srt_time = srt_time;

            for (let i = srt_date; ; i = (i + 1) % 7) {
                if (newVoteStyle) tmp_dstring[i] = 1;
                else {
                    for (let j = srt_time; ; j++) {
                        const dj = j % 24;
                        tmp_dstring[(i + Math.floor(j / 24)) % 7] |= (1 << dj);
                        if (j == end_time) break;
                    }
                }
                if (i == end_date) break;
            }
        }
        if (newVoteStyle) {
            let possibleDate = []
            for (let i = 0; i < 7; i++) if (tmp_dstring[i] === 1) possibleDate.push(i);

            return { date: possibleDate.join('|'), time: [min_srt_time % 24, (max_end_time + 1) % 24] }
        }
        return tmp_dstring;
    },
    timeWrap(timeslot) {
        const tmp_strings = []
        // combining time by date
        for (let i = 0; i < 7; i++) {
            let tmp_1 = null
            for (let j = 0; j < 24; j++) {
                if ((timeslot[i] & (1 << j)) !== 0) {
                    if (tmp_1 === null) tmp_1 = j;
                } else {
                    if (tmp_1 !== null) {
                        tmp_strings.push(`${RDSTRING[i]}:${tmp_1 + 1 === j ? tmp_1 : tmp_1 + '-' + (j - 1)}`)
                        tmp_1 = null
                    }
                }
            }
            if (tmp_1 !== null) tmp_strings.push(`${RDSTRING[i]}:${tmp_1 === 23 ? 23 : tmp_1 + '-' + 23}`)
        }
        // combining date
        return tmp_strings.reduce((comb, curr) => {
            let changed = false;
            if (comb.length > 0) {
                for (let j = 0; j < comb.length; j++) {
                    const le = comb[j]
                    const les = le.split(':')
                    const curs = curr.split(':')
                    if (les[1] == curs[1]) {
                        comb[j] = les[0] + ',' + curs[0] + ':' + les[1]
                        changed = true;
                    }
                }
            }
            if (!changed) comb.push(curr)
            return comb
        }, []).join(", ")
    },
    timeToAvailability(timeOfSlot, timeslot) {
        const slotData = Object.values(timeOfSlot)
        let availArr = new Array(slotData.length).fill(0)
        for (let day = 0; day < 7; day++) {
            for (let hour = 0; hour < 24; hour++) {
                for (let avail of slotData) {
                    if (avail.time.day === day && avail.time.hour === hour && (timeslot[day] & 1 << hour) !== 0) {
                        availArr[avail.idx] = 1
                    }
                }
            }
        }
        return availArr.join('')
    },
    enday2num(string) {
        return DSTRING_EN[string]
    },
}

module.exports = parser