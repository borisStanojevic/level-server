const net = require("net");
const JsonSocket = require("json-socket");

const client = new net.Socket();
const port = 6969;
const host = "127.0.0.1";

client.connect(port, host, () => {
	console.log(`Connection established with server ${host}:${port}`);

	client.on("data", (data) => {
		console.log(JSON.parse(data));

		client.end();
	})
});

const putMessage = {

		id: 1,
		first_name: "Logan",
		last_name: "Kollaschek",
		email: "lkollaschek0@dedecms.com",
		gender: "Male"
};

function put(key, value){
	const message = {
		type: "PUT",
		key,
		value
	};

	JsonSocket.sendSingleMessageAndReceive(port, host, message, function(error, response) {
		if (error) 
			throw error;

		console.log("PUT RESPONSE: ");
		console.log(response);
	});
};

function get(key) {
	const message = {
		type: "GET",
		key
	};

	JsonSocket.sendSingleMessageAndReceive(port, host, message, function(error, response) {
		if (error)
			throw error;

		console.log("GET RESPONSE: ");
		console.log(response);
	});
}

put("xxx", putMessage);

get("xxx");
