const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser')
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
   extended: false
}))
app.listen(3000, () => console.log('listening..'));
app.use(express.json({
   limit: '1mb'
}));
app.use(express.static('public'));
app.use('/profit', express.static('public'));
app.use('/profit-citytarget', express.static('public'));;

app.post('/items', async (request, response) => {
   console.log(request.body);
   gotData = request.body;
   response.json({
      status: 'Success, please wait data is being calculate',
      items: request.body.items,
      selectedCity: request.body.selectedCity
   })
});

app.get('/result', async (request, response) => {
   await calculateResult();
   response.json(result);
});

//data and selectedCity
let gotData = {};

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

}];


async function calculateResult() {
   const cities = ['Bridgewatch', 'Caerleon', 'Fort Sterling', 'Lymhurst', 'Martlock', 'Thetford'];
   const cities_url = 'Lymhurst,Caerleon,Bridgewatch,Martlock,Thetford,FortSterling'
   const selectedCity = gotData.cityTarget;
   let selectedCityIndex;

   for (let i = 0; i < cities.length; i++) {
      if (selectedCity == cities[i]) {
         selectedCityIndex = i;
         break;
      }
   }
   console.log(selectedCityIndex);
   for (let i = 0; i < gotData.items.length; i++) {
      gotData.items[i] = gotData.items[i].replace(/\r?\n|\r/gm, "");
      const api_url = 'https://www.albion-online-data.com/api/v2/stats/Prices/' + gotData.items[i] + '?locations=' + cities_url;
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
   await bubbleSort(result);
   await takeTop10(result);
   console.log(result);
}

async function takeTop10(result) {
   for (let i = 0; i < result.length; i++) {
      let length = result[i].bestProfit.length;
      let city = result[i];
      for (let j = length - 11; j >= 0; j--) {
         city.bestProfit.pop();
         city.bestItems.pop();
         city.date.pop();
         city.targetDate.pop();
      }
   }
}
async function bubbleSort(result) {
   for (let k = 0; k < result.length; k++) {
      let length = result[k].bestProfit.length;
      let city = result[k];
      for (let i = length - 1; i >= 0; i--) {
         //Notice that j < (length - i)
         for (let j = length - 1 - i; j >= 0; j--) {
            //Compare the adjacent positions
            if (city.bestProfit[j] > city.bestProfit[j - 1]) {
               //Swap the numbers
               let tempbestProfit = city.bestProfit[j]; //Temporary variable to hold the current number
               let tempbestItems = city.bestItems[j];
               let tempdate = city.date[j];
               let temptargetDate = city.targetDate[j];

               city.bestProfit[j] = city.bestProfit[j - 1]; //Replace current number with adjacent number
               city.bestItems[j] = city.bestItems[j - 1];
               city.date[j] = city.date[j - 1];
               city.targetDate[j] = city.targetDate[j - 1];

               city.bestProfit[j - 1] = tempbestProfit; //Replace adjacent number with current number
               city.bestItems[j - 1] = tempbestItems;
               city.date[j - 1] = tempdate;
               city.targetDate[j - 1] = temptargetDate;
            }
         }
      }
   }
}