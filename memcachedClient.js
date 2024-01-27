const Memcached = require("memcached");
const { HOST, PORT } = require("./config");

const memcached = new Memcached(`${HOST}:${PORT}`);

// Example: Set a key-value pair
memcached.set("example_key", "example_value", 100, (err) => {
  if (err) {
    console.error("NOT-STORED \r\n");
  } else {
    console.log("STORED");
  }
});

// Example: Get the value for a key
memcached.get("example_key", (err, value) => {
  if (err) {
    console.error("Error getting value:", err);
  } else {
    const key = "example_key";
    console.log(`VALUE ${key} ${value.length}\r\n${value}\r\nEND\r\n`);
  }
});

// Close the connection when done
memcached.end();
