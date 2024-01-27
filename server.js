const net = require("net");
const { Mutex } = require("async-mutex");

const { HOST, PORT } = require("./config");
const {
  randomSleep,
  removeBackspaces,
  readJSONFile,
  writeJSONFile,
} = require("./utils");

const [memcacheServer] = process.argv.slice(2);

function TCPServer(port, host) {
  const server = net.createServer();
  const sockets = [];
  const delimiter = "\r\n";
  const welcomeMessage = `Welcome to Memcached-lite!\r\nUse 'set' to store key-value pairs\r\nUse 'get' to retrieve the value of a key\r\nGet ready for a cache-tastic experience!\r\n\r\n`;
  const fileLock = new Mutex();

  async function handleSetRequest(key, flags, exptime, bytes, value) {
    const release = await fileLock.acquire();
    await randomSleep();
    try {
      const jsonData = await readJSONFile("kvstore.json");
      jsonData[key] = { flags, exptime, bytes, value };
      await writeJSONFile("kvstore.json", jsonData);
      return "STORED \r\n";
    } catch (err) {
      console.error(err);
      return "NOT-STORED \r\n";
    } finally {
      release();
    }
  }

  async function handleGetRequest(key) {
    const release = await fileLock.acquire();
    await randomSleep();
    try {
      const jsonData = await readJSONFile("kvstore.json");
      if (jsonData[key]) {
        const { value } = jsonData[key];
        return `VALUE ${key} ${value.length}\r\n${value}\r\nEND\r\n`;
      }
      return "null\r\n";
    } catch (err) {
      console.error(err);
      return "Internal Server Error \r\n";
    } finally {
      release();
    }
  }

  async function onData(socket, data) {
    let { key, flags, exptime, bytes, receivedData } = socket.state;
    receivedData += data.toString();

    while (receivedData.includes(delimiter)) {
      const firstClrfIdx = receivedData.indexOf(delimiter);
      const command = removeBackspaces(receivedData.slice(0, firstClrfIdx));
      receivedData = receivedData.slice(firstClrfIdx + 2);

      const arr = command.trim().split(" ");

      if (arr[0] == "set") {
        if (arr.length == 3) {
          [_, key, bytes] = arr;
          flags = 0;
          exptime = 100;
        } else {
          [_, key, flags, exptime, bytes] = arr;
        }
        value = "";
      } else if (arr[0] == "get") {
        key = arr[1];
        const message = await handleGetRequest(key);
        key = flags = exptime = bytes = value = "";
        socket.write(message);
      } else if (bytes) {
        value = command;
        const message = await handleSetRequest(
          key,
          Number(flags),
          Number(exptime),
          Number(bytes),
          value
        );
        key = flags = exptime = bytes = value = "";
        socket.write(message);
      }
    }

    socket.state = { key, flags, exptime, bytes, receivedData };
  }

  server.on("connection", (socket) => {
    socket.state = {
      key: "",
      flags: "",
      exptime: "",
      bytes: "",
      receivedData: "",
    };
    sockets.push(socket);

    console.log(
      `Client Connected from ${socket.remoteAddress}:${socket.remotePort}`
    );

    socket.setEncoding("utf-8");

    if (memcacheServer === "false") socket.write(welcomeMessage);

    socket.on("data", async (data) => {
      await onData(socket, data);
    });

    socket.on("close", () => {
      console.log(
        `Closed Connection from ${socket.remoteAddress}:${socket.remotePort}`
      );
    });

    socket.on("error", (err) => {
      console.error(
        `Client Error ${socket.remoteAddress}:${socket.remotePort}`
      );
    });
  });

  return new Promise((resolve, reject) => {
    server.listen(port, host, () => {
      console.log(
        `TCP server listening on ${server.address().address}:${
          server.address().port
        }`
      );
      resolve();
    });
  });
}

TCPServer(PORT, HOST).then(() => {});
