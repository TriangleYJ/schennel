const { default: axios } = require("axios");

const cht = {};
cht.commandHandler = {
    createVote() {

    },
    doVote() {

    },
    confirmVote() {

    },
    cancelVote() {

    },
    cancelVote() {

    },
    alertVote() {

    },
    currentVote() {

    },
    remind() {

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