const { TCPClient } = require("./customClient");

// TEST1: Multiple SET commands
async function test1() {
  const client = await TCPClient(3000, "127.0.0.1");
  let response = await client.set("phone", "8106501550");
  console.log(response);

  response = await client.set("food", "burger");
  console.log(response);

  response = await client.set("phone", "9959033630");
  console.log(response);

  response = await client.set("phone", "8128039055");
  console.log(response);

  response = await client.set("food", "Biryani");
  console.log(response);

  await client.disconnect();
  console.log("Client Disconnected From Server\n");
}

// TEST2: Multiple GET commands
async function test2() {
  const client = await TCPClient(3000, "127.0.0.1");
  let response = await client.get("phone");
  console.log(response);

  response = await client.get("food");
  console.log(response);

  response = await client.get("phone");
  console.log(response);

  response = await client.get("phone");
  console.log(response);

  response = await client.get("food");
  console.log(response);

  await client.disconnect();
  console.log("Client Disconnected From Server\n");
}

// TEST3: Random SET and GET commands
async function test3() {
  const client = await TCPClient(3000, "127.0.0.1");
  // set name as "Anurag"
  let response = await client.set("name", "Anurag");
  console.log(response);

  // get name
  response = await client.get("name");
  console.log(response);

  // set name as "Hanuman"
  response = await client.set("name", "Hanuman");
  console.log(response);

  // get name
  response = await client.get("name");
  console.log(response);

  // get name
  response = await client.get("name");
  console.log(response);

  // set address as "Bloomington, Indiana"
  response = await client.set("address", "Bloomington, Indiana");
  console.log(response);

  // get address
  response = await client.get("address");
  console.log(response);

  // set address as "Chicago, Illionis"
  response = await client.set("address", "Chicago, Illionis");
  console.log(response);

  // get address
  response = await client.get("address");
  console.log(response);

  // get address
  response = await client.get("address");
  console.log(response);

  await client.disconnect();
  console.log("Client Disconnected From Server\n");
}

// TEST4: Make Concurrent Requests from 3 Clients
async function test4() {
  async function client1() {
    const client = await TCPClient(3000, "127.0.0.1");
    // set course as "Computer Science"
    console.log("Client 1 SET Request Sent");
    let response = await client.set("course", "Computer Science");
    console.log("Client 1 SET Response");
    console.log(response);

    // get course
    console.log("Client 1 GET Request Sent");
    response = await client.get("course");
    console.log("Client 1 GET Response");
    console.log(response);

    await client.disconnect();
    console.log("Client 1 Disconnected From Server\n");
  }

  async function client2() {
    const client = await TCPClient(3000, "127.0.0.1");

    // set course as "Data Science"
    console.log("Client 2 SET Request Sent");
    let response = await client.set("course", "Data Science");
    console.log("Client 2 SET Response");
    console.log(response);

    // get course
    console.log("Client 2 GET Request Sent");
    response = await client.get("course");
    console.log("Client 2 GET Response");
    console.log(response);

    await client.disconnect();
    console.log("Client 2 Disconnected From Server\n");
  }

  async function client3() {
    const client = await TCPClient(3000, "127.0.0.1");
    // set course as "Information Science"
    console.log("Client 3 SET Request Sent");
    let response = await client.set("course", "Information Science");
    console.log("Client 3 SET Response");
    console.log(response);

    // get course
    console.log("Client 3 GET Request Sent");
    response = await client.get("course");
    console.log("Client 3 GET Response");
    console.log(response);

    await client.disconnect();
    console.log("Client 3 Disconnected From Server\n");
  }

  const tests = [client1(), client2(), client3()];
  await Promise.all(tests);
}

async function TestCaseRunner() {
  console.log(
    "********************************** TEST 1 STARTED **********************************\n"
  );
  await test1();
  console.log(
    "********************************* TEST 1 COMPLETED *********************************\n"
  );

  console.log(
    "********************************** TEST 2 STARTED **********************************\n"
  );
  await test2();
  console.log(
    "********************************* TEST 2 COMPLETED *********************************\n"
  );

  console.log(
    "********************************** TEST 3 STARTED **********************************\n"
  );
  await test3();
  console.log(
    "********************************* TEST 3 COMPLETED *********************************\n"
  );

  console.log(
    "********************************** TEST 4 STARTED **********************************\n"
  );
  await test4();
  console.log(
    "********************************* TEST 4 COMPLETED *********************************\n"
  );
}

TestCaseRunner().then(() => {
  console.log(
    "******************************** ALL TESTS COMPLETED ********************************\n"
  );
});
