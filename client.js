const net = require('net');

const client = new net.Socket();
const port = 6969;
const host = "127.0.0.1";

client.connect(port, host, () => {
    console.log("Connected");

    client.on("data", (data) => {
        console.log(JSON.parse(data));

        client.end();
    })
});

const putMessage = {
    t: "P",
    d: {
        id: 1,
        first_name: "Logan",
        last_name: "Kollaschek",
        email: "lkollaschek0@dedecms.com",
        gender: "Male"
    }
};

const getMessage = {
    t: "G",
    d: {
        key: 1
    }
};

client.write(JSON.stringify(putMessage));

client.write(JSON.stringify(getMessage));

