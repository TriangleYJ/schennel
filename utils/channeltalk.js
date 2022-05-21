const { default: axios } = require("axios");
const schedule = require("./schedule")

const cht = {};
cht.commandHandler = {
    async createVote(args) {
        schedule.createVote()
        return "hello"
    },
    async doVote() {

    },
    async confirmVote() {

    },
    async cancelVote() {

    },
    async alertVote() {

    },
    async listVote() {

    },
    async checkoutVote() {

    },
    async currentVote() {

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