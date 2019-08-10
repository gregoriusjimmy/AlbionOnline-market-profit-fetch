// the data that will be sent to the server
const sendData = {
  items: [],
  cityTarget: ""
};
// array for store regex
const allRegex = [];
// array for DOM
const t4level = [];
const t5level = [];
const t6level = [];
const t7level = [];
async function getItems() {
  //fetch items.txt
  const response = await fetch("items.txt");
  const data = await response.text();
  const e = document.getElementById("city-select");
  //get target city from select element
  const selectedCity = e.options[e.selectedIndex].value;
  sendData.cityTarget = selectedCity;

  // selection items
  t7level[0] = document.getElementById("t7level0");
  t6level[0] = document.getElementById("t6level0");
  for (let i = 0; i < 4; i++) {
    t4level[i] = document.getElementById("t4level" + i);
    t5level[i] = document.getElementById("t5level" + i);
  }
  // check the checkbox if checked or not
  // if checked store the regex to the allRegex array

  allRegex.push(/T[23]\w+$/m); // default items
  if (t4level[0].checked) {
    allRegex.push(/T4_\w+$/m);
  }
  if (t4level[1].checked) {
    allRegex.push(/T4_\w+@1/);
  }
  if (t4level[2].checked) {
    allRegex.push(/T4_\w+@2/);
  }
  if (t4level[3].checked) {
    allRegex.push(/T4_\w+@3/);
  }
  if (t5level[0].checked) {
    allRegex.push(/T5_\w+$/m);
  }
  if (t5level[1].checked) {
    allRegex.push(/T5_\w+@1/);
  }
  if (t5level[2].checked) {
    allRegex.push(/T5_\w+@2/);
  }
  if (t5level[3].checked) {
    allRegex.push(/T4_\w+@3/);
  }
  if (t6level[0].checked) {
    allRegex.push(/T6_\w+$/m);
  }
  if (t7level[0].checked) {
    allRegex.push(/T7_\w+$/m);
  }

  // get each item in items.txt
  const rows = data.split("\n");
  rows.forEach(element => {
    const item = element;
    // for every item ,if the item match any allRegex's array
    // store the item to the sendData
    for (let i = 0; i < allRegex.length; i++)
      if (item.match(allRegex[i])) {
        sendData.items.push(item);
      }
  });

  // change fetch method to POST
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(sendData, null, 2) // send sendData to the server with JSON format
  };

  //send senData to ther /items route
  const response_items = await fetch("/items", options);
  const json = await response_items.json();
  console.log(json);
}

// if client click submit button do all of those things
document.getElementById("submit").onclick = async () => {
  await getItems();
  getResult();
};

// receive the answer from the server after the data had been calculated
async function getResult() {
  const response_result = await fetch("/result");
  const result_json = await response_result.json();
  console.log(result_json);
}
