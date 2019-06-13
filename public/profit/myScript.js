const items = [];
const allRegex = [];
const t4level = [];
const t5level = [];
async function getItems() {
   const response = await fetch('items.txt');
   const data = await response.text();

   // selection
   for (let i = 0; i < 3; i++) {
      t4level[i] = document.getElementById('t4level' + (i + 1));
      t5level[i] = document.getElementById('t5level' + (i + 1));

   }
   console.log(t4level);
   if (t4level[0].checked) {
      allRegex.push(/T4_\w+@1/);
   }
   if (t4level[1].checked) {
      allRegex.push(/T4_\w+@2/);
   }
   if (t4level[2].checked) {
      allRegex.push(/T4_\w+@3/);
   }
   if (t5level[0].checked) {
      allRegex.push(/T5_\w+@1/);
   }
   if (t5level[1].checked) {
      allRegex.push(/T5_\w+@2/);
   }
   if (t5level[2].checked) {
      allRegex.push(/T5_\w+@3/);
   }
   allRegex.push(/T\w_\w+$/m);

   // console.log(allRegex);

   const rows = data.split('\n');
   rows.forEach(element => {
      const item = element.substring(4);
      // console.log(item);
      for (let i = 0; i < allRegex.length; i++)
         if (item.match(allRegex[i])) {
            items.push(item);
         }
   });
   console.log(items);
}

async function getData() {
   await getItems();
   const cities = ['Bridgewatch', 'Caerleon', 'Fort Sterling', 'Lymhurst', 'Martlock', 'Thetford'];
   let bestProfit = [0, 0, 0, 0, 0, 0];
   let bestItem = [];
   const e = document.getElementById("city-select");
   const selectedCity = e.options[e.selectedIndex].value;
   //Bw,Caer,Fort,Lym,Mart,Thet
   for (let i = 0; i < items.length; i++) {
      const cities_url = 'Lymhurst,Caerleon,Bridgewatch,Martlock,Thetford,FortSterling'
      const api_url = 'https://www.albion-online-data.com/api/v2/stats/Prices/' + items[i] + '?locations=' + cities_url;
      const response = await fetch(api_url);
      const data = await response.json();

      // console.log(data);
      for (let j = 0; j < data.length; j++) {
         if (j == selectedCity) {
            bestItem[j] = 'Selected City';
            continue
         };
         let profit = data[j].sell_price_min - data[selectedCity].sell_price_min;
         console.log(profit);
         if (profit > bestProfit[j] && profit < 1000000) {
            bestProfit[j] = profit;
            bestItem[j] = data[j].item_id;
         }
         // from = data[selectedCity];
         // let sell = data[j];
         // let profit = sell.sell_price_min - from.sell_price_min;
         // console.log(profit);
         // if (profit > bestProfit && profit < 1000000) {
         //    bestItem = sell.item_id;
         //    bestProfit = profit;
         //    bestCity = sell.city;
         // }
      }

   }
   for (let i = 0; i < cities.length; i++) {
      document.getElementById('city' + i).innerHTML = cities[i];
      document.getElementById('item' + i).innerHTML = bestItem[i];
      document.getElementById('profit' + i).innerHTML = bestProfit[i];
   }
   console.log(selectedCity);
   console.log(bestItem);
   console.log(bestProfit);
}

document.getElementById('submit').onclick = () => {
   getData();
};