const Memcached = require("memcached");

const memcached = new Memcached("127.0.0.1:3000");

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
