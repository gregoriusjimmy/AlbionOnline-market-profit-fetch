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
   let bestProfit = 0;
   let bestCity;
   let bestItem;
   for (let i = 0; i < items.length; i++) {
      const cities = 'Bridgewatch,Caerleon,Lymhurst,Martlock';
      const api_url = 'https://www.albion-online-data.com/api/v2/stats/Prices/' + items[i] + '?locations=' + cities;
      const response = await fetch(api_url);
      const data = await response.json();
      // console.log(data);
      for (let j = 0; j < data.length; j++) {
         let from = data[0];
         let sell = data[j];
         let profit = from.sell_price_min - sell.sell_price_min;
         console.log(profit);
         if (profit > bestProfit) {
            bestItem = sell.item_id;
            bestProfit = profit;
            bestCity = sell.city;
         }
      }

   }
   document.getElementById('cityFrom').innerHTML = "Bridgewatch";
   document.getElementById('cityTo').innerHTML = bestCity;
   document.getElementById('item').innerHTML = bestItem;
   document.getElementById('profit').innerHTML = bestProfit;

   console.log(bestCity);
   console.log(bestProfit);
   console.log(bestItem);
}


getData();