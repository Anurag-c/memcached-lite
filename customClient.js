const net = require("net");

function TCPClient(port, host) {
  const client = net.Socket();

  function sendRequest(command, key, flags, exptime, bytes, value) {
    return new Promise((resolve, reject) => {
      let delimiter = "\r\n";
      if (command == "get") {
        delimiter = "END\r\n";
      }

      let receivedData = "";

      const onData = (data) => {
        receivedData += data.toString();

        if (receivedData.includes(delimiter)) {
          const [response, restData] = receivedData.split(delimiter, 2);
          receivedData = restData;
          resolve(response + delimiter);
          client.off("data", onData);
          return;
        }
      };

      client.on("data", onData);

      // Construct the request based on the command
      if (command == "set") {
        console.log(`${command} ${key} ${bytes}`);
        console.log(`${value}\r\n`);
        client.write(`${command} ${key} ${bytes}\r\n`);
        client.write(`${value}\r\n`);
      } else if (command == "get") {
        console.log(`${command} ${key}\r\n`);
        client.write(`${command} ${key}\r\n`);
      } else {
        reject("Make a set / get request with proper parameters");
      }
    });
  }

  async function setRequest(key, value) {
    return sendRequest("set", key, 0, 100, value.length, value);
  }

  async function getRequest(key) {
    return sendRequest("get", key);
  }

  function disconnect() {
    client.end();
    return new Promise((resolve) => client.on("end", resolve));
  }

  client.on("error", (err) => {
    console.error(err.message);
  });

  client.on("close", () => {});

  const obj = {
    set: setRequest,
    get: getRequest,
    disconnect,
  };

  return new Promise((resolve) => {
    client.once("data", (data) => {
      obj.host = client.address().address;
      obj.port = client.address().port;
      console.log(
        `Client ${obj.host}:${obj.port} Connection established with ${host}:${port}\n`
      );
      console.log(data.toString());
      resolve(obj);
    });
    client.connect(port, host, () => {});
  });
}

module.exports = { TCPClient };
