const items = [];
const allRegex = [];
const t4level = [];
const t5level = [];

var result = [{
   city: "Bridgewatch",
   bestItems: [],
   bestProfit: [],
   date: [],
   targetDate: [],
   count: 0

}, {
   city: "Caerleon",
   bestItems: [],
   bestProfit: [],
   date: [],
   targetDate: [],
   count: 0

}, {
   city: "Fort Sterling",
   bestItems: [],
   bestProfit: [],
   date: [],
   targetDate: [],
   count: 0

}, {
   city: "Lymhurst",
   bestItems: [],
   bestProfit: [],
   date: [],
   targetDate: [],
   count: 0

}, {
   city: "Martlock",
   bestItems: [],
   bestProfit: [],
   date: [],
   targetDate: [],
   count: 0

}, {
   city: "Thetford",
   bestItems: [],
   bestProfit: [],
   date: [],
   targetDate: [],
   count: 0

}]

async function getItems() {
   const response = await fetch('items.txt');
   const data = await response.text();

   // selection
   for (let i = 0; i < 4; i++) {
      t4level[i] = document.getElementById('t4level' + i);
      t5level[i] = document.getElementById('t5level' + i);

   }
   console.log(t4level);
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
   allRegex.push(/T[23]\w+$/m);

   console.log(allRegex);

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
const cities = ['Bridgewatch', 'Caerleon', 'Fort Sterling', 'Lymhurst', 'Martlock', 'Thetford'];

async function getData() {
   await getItems();
   const cities_url = 'Lymhurst,Caerleon,Bridgewatch,Martlock,Thetford,FortSterling'
   const e = document.getElementById("city-select");
   const selectedCity = e.options[e.selectedIndex].value;
   let selectedCityIndex;

   for (let i = 0; i < cities.length; i++) {
      if (selectedCity == cities[i]) {
         selectedCityIndex = i;
      }
   }
   console.log(selectedCityIndex);
   for (let i = 0; i < items.length; i++) {

      const api_url = 'https://www.albion-online-data.com/api/v2/stats/Prices/' + items[i] + '?locations=' + cities_url;
      const response = await fetch(api_url);
      const data = await response.json()
      for (let j = 0; j < cities.length; j++) {
         if (j == selectedCityIndex) {
            continue;
         }

         let counter = result[j].count;
         let profit = data[selectedCityIndex].sell_price_min - data[j].sell_price_min;
         console.log(profit);

         result[j].bestProfit[counter] = 0;
         if (profit > result[j].bestProfit[counter]) {

            result[j].bestItems[counter] = data[j].item_id;
            result[j].bestProfit[counter] = profit
            result[j].date[counter] = data[j].sell_price_min_date;
            result[j].targetDate[counter] = data[selectedCityIndex].sell_price_min_date;
            result[j].count = result[j].count + 1;
         }
      }
   }
   console.log(result);


}
document.getElementById('submit').onclick = () => {
   getData();

};