const { default: axios } = require("axios");

const cht = {
    GROUP_ID: process.env.GROUP_ID ?? 0xdeadbeef,
    BOT_NAME: process.env.BOT_NAME ?? "schennel",
};

cht.hello = (res) => res + 1;
cht.log = (token, data) => {
    console.log("token", data);
    console.log("Message sent: ", data);
}
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