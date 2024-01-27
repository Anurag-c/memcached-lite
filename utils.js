const fs = require("fs").promises;

function randomSleep() {
  const randomDelay = Math.floor(Math.random() * 1000);
  return new Promise((resolve) => setTimeout(resolve, randomDelay));
}

function removeBackspaces(str) {
  while (str.indexOf("\b") != -1) {
    str = str.replace(/.\x08/, "");
  }
  return str;
}

async function readJSONFile(filename) {
  try {
    let fileData = await fs.readFile(filename, "utf8");
    if (!fileData) fileData = "{}";
    const jsonData = JSON.parse(fileData);
    return jsonData;
  } catch (err) {
    console.error(err);
    throw new Error(`Error Reading JSON file : ${filename}`);
  }
}

async function writeJSONFile(filename, jsonData) {
  try {
    const updatedJsonData = JSON.stringify(jsonData, null, 2);
    await fs.writeFile(filename, updatedJsonData, "utf8");
  } catch (err) {
    console.error(err);
    throw new Error(`Error Writing to JSON file : ${filename}`);
  }
}

module.exports = { randomSleep, removeBackspaces, readJSONFile, writeJSONFile };
