const items = [];

async function getItems() {
   const response = await fetch('items.txt');
   const data = await response.text();


   const rows = data.split('\n');
   rows.forEach(element => {
      const item = element.substring(4);

      items.push(item);
   });
   // console.log(items);
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