const net = require("net");
const {
    Level
} = require("level")
const JsonSocket = require("json-socket");

const db = new Level("db", {
    keyEncoding: "view",
    valueEncoding: "json"
});

const port = 6969;
const host = "127.0.0.1";

const server = net.createServer();
server.listen(port, host, () => {
    console.log(`Level DB server running on ${port}...`);
});

server.on("connection", (socket) => {
    const {
        remoteAddress,
        remotePort,
        end
    } = socket;
    socket = new JsonSocket(socket);

    console.log(`Connection opened for client ${remoteAddress}:${remotePort}`)

    socket.on("message", (message) => {
        console.log(`Received data from client ${remoteAddress}:${remotePort}`);

        switch (message.type) {
            case "PUT":
                db.put(message.key, message.value, (error) => {
                    if (error)
                        throw Error("Put failed");

                    socket.sendEndMessage({
                        key: message.key
                    });
                });
                break;
            case "GET":
                db.get(message.key, (error, value) => {
                    if (error)
                        throw new Error("Get failed");

                    socket.sendEndMessage(value);
                });
                break;
            case "GET_MANY":
                db.get(message.keys, (error, values) => {
                    if (error)
                        throw new Error("Get many failed");

                    socket.sendEndMessage(values);
                })
            case "DEL":
                db.del(message.key, (error) => {
                    if (error)
                        throw new Error("Delete failed");

                    end();
                });
                break;
            default:
                throw Error("Unsupported operation type");
        }
    });

    socket.on("close", (data) => {
        console.log(`Connection closed for client ${remoteAddress}:${remotePort}`)
    });

    socket.on("error", (error) => {
        console.error(`Client connection error for client ${remoteAddress}:${remotePort}`)
    });
});
