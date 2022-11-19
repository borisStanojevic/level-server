const net = require("net");
const { nanoid } = require("nanoid")
const { Level } = require("level")

const port = 6969;
const host = "127.0.0.1";

const db = new Level("db", { valueEncoding: "json" });

const server = net.createServer();

let id = 1;

server.on("connection", (socket) => {
    console.log(`Connection opened for client ${socket.remoteAddress}:${socket.remotePort}`)

    socket.setEncoding('utf8');

    socket.on("data", (data) => {
        console.log(`Received data from client ${socket.remoteAddress}:${socket.remotePort}`);
        console.log(`Type of data: ${typeof data}`);

        const message = JSON.parse(data);

        switch (message.t) {
            case "P":
                db.put(id, message.d, (error) => {
                    if(error)
                        throw Error("Put failed");
                    
                    socket.write(JSON.stringify({id}));
                    id++;
                });
                break;
            case "G":
                db.get(message.d.key, (error, value) => {
                    console.log("KEY: " + message.d.key);
                    console.log("ERROR: " + error);
                    console.log("VALUE: " + JSON.stringify(value));
                    socket.write(JSON.stringify(value));
                });
                break;
            case "D":
                db.del(message.d.key);
                break;
            default:
                throw Error("Unsupported operation type");
        }
    });

    socket.on("close", (data) => {
        console.log(`Connection closed for client ${socket.remoteAddress}:${socket.remotePort}`)
    });

    socket.on("error", (error) => {
        console.error(`Client connection error for client ${socket.remoteAddress}:${socket.remotePort}`)
    });
});

server.listen(port, host, () => {
    console.log(`Level DB server running on port ${port}`);
});