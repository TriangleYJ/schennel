const { createVote, doVote, confirmVote, cancelVote, listVote, checkoutVote, alertVote, currentVote, remind } = require('../utils/channeltalk').commandHandler
const batch = {}

batch.reminder_command = {
    "테스트": {
        func: (args) => `hello ${args[0]}`,
        intro: '테스트 명령어입니다.\n'
    },
    "테32": {
        func: () => "hello2",
        intro: '1234234.\n'
    },
    "사용법": {
        func: async () => Object.keys(batch.reminder_command).map(x => "<b>!리마인더 " + x + "</b> : " + batch.reminder_command[x].intro).join(""),
        intro: '리마인드 사용법을 호출합니다.'
    }
}

batch.commands = { // If too long, Can't print...
    "!시간규칙": {
        func: () => `시간은 다음과 같은 규칙으로 입력할 수 있습니다.|>>syntax: ([월~일](-[월~일]):[0~23](-[0~23]), )*\n예시: 월-14 or 월-수:2 or 월:12-19 or 월-수:2-23 or 금-화:23-2, 수:3-4, 목:1, 금:2, 토-일:1-23|
        콜론 사이에 공백이 있으면 안되며, 24시를 사용해야 합니다. 시간이 24시를 넘긴 경우 다음날 새벽으로 인식합니다.\n또한 1-2의 의미는 1시부터 2시 59분까지를 의미합니다. 1시 59분까지만 표현하고 싶다면 1-1 혹은 1로 표현하세요.`,
        intro: '시간 규칙을 출력합니다. 처음 쓰시는 분들은 꼭 확인하세요!\n',
    },
    "!리마인더": {
        func: (args) => args.length > 0 ? batch.reminder_command[args[0]].func(args.slice(1)) : "인자 수가 부족합니다!",
        intro: `리마인더 관련 명령어입니다. 자세한 사용법은 !리마인더 사용법으로 확인해세요\n`
    },
    "!테스트": {
        func: (args, userid) => `${userid}님의 새로운 메시지: ${args}`,
        intro: `간단한 echo 테스트 커맨드입니다.\n`,
        aux: body => body.refers.manager.name
    },
    "!투표생성": {
        func: createVote,
        intro: `태그가 된 사람들이 투표를 마무리할 때까지 일정 조사를 진행합니다. When2Meet 주소를 생성합니다.|
        >>예시: !투표생성 월-수:9-23 [새로운 일정 이름] @투표자1 @투표자2 @투표자3|`,
        aux: body => body.entity.blocks[0].value
    },
    "!투표": {
        func: doVote,
        intro: `현재 진행중인 일정에 투표합니다|
        >>예시: !투표 목:11-13, 금:13-16, 일-화:12-15|`,
        aux: body => body.refers.manager.name
    },
    "!투표확정": {
        func: confirmVote,
        intro: `현재 투표를 종료하고, 한시간 전에 투표한 사람들에 대해 리마인더 메시지를 보내줍니다.|
        >>예시: !투표확정 수:11-15 2021-02-23|`
    },
    "!투표삭제": {
        func: cancelVote,
        intro: `현재 진행중인 일정조사를 삭제합니다.\n`
    },
    "!투표목록": {
        func: listVote,
        intro: `종료되지 않은 투표목록과 현재 진행중인 투표를 보여줍니다.\n`
    },
    "!투표전환": {
        func: checkoutVote,
        intro: `현재 진행중인 투표를 주어진 이름으로 전환합니다.|\n`
    },
    "!투표해주세요": {
        func: alertVote,
        intro: `투표 생성 시 태그가 된 사람들 중 아직 투표하지 않은 사람들이 있으면 메시지를 보내줍니다.\n`
    },
    "!현재투표": {
        func: currentVote,
        intro: `투표를 한 사람과, 조사 링크를 보여줍니다.\n`
    },
    "!사용법": {
        func: async () => Object.keys(batch.commands).map(x => "<b>" + x + "</b> : " + batch.commands[x].intro).join(""),
        intro: "사용법을 호출합니다."
    }
}

module.exports = batch