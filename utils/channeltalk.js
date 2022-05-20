const cht = {};

cht.hello = (res) => res + 1;
cht.sendMessage = (data) => {
    console.log("Message sent: ", data);
    

}

module.exports = cht;