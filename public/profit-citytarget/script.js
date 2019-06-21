const sendData = {
   items: [],
   cityTarget: ''
};
const allRegex = [];
const t4level = [];
const t5level = [];
const t6level = [];

async function getItems() {
   const response = await fetch('items.txt');
   const data = await response.text();
   const e = document.getElementById("city-select");
   const selectedCity = e.options[e.selectedIndex].value;
   sendData.cityTarget = selectedCity;
   t6level[0] = document.getElementById('t6level0');
   // selection
   for (let i = 0; i < 4; i++) {
      t4level[i] = document.getElementById('t4level' + i);
      t5level[i] = document.getElementById('t5level' + i);

   }
   // console.log(t4level);
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
      allRegex.push(/T6_\w+$/m)
   }
   allRegex.push(/T[23]\w+$/m);

   // console.log(allRegex);

   const rows = data.split('\n');
   rows.forEach(element => {
      const item = element //.substring(4);
      // console.log(item);
      for (let i = 0; i < allRegex.length; i++)
         if (item.match(allRegex[i])) {
            sendData.items.push(item);
         }
   });


   // console.log(items);
   const options = {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json'
      },
      body: JSON.stringify(sendData, null, 2)
   };
   //sending items to ther serer

   const response_items = await fetch('/items', options);
   const json = await response_items.json();
   console.log(json);
}



document.getElementById('submit').onclick = async () => {
   await getItems();
   getResult();
};

async function getResult() {
   const response_result = await fetch('/result');
   const result_json = await response_result.json();
   console.log(result_json);
}