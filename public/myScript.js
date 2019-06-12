let timeLength = 12;
let pricesCategory = 1;

async function getData() {
   const xs = [];
   const ys = [];
   const item = 'T4_CLOTH';
   const e = document.getElementById("city-select");
   const city = e.options[e.selectedIndex].value;
   const api_url =
      'https://www.albion-online-data.com/api/v1/stats/Charts/' + item + '?locations=' + city;

   const response = await fetch(api_url);
   const data = await response.json();
   console.log(data[0].location);
   const labels = data[0].data;
   for (let i = labels.timestamps.length - timeLength; i < labels.timestamps.length; i++) {
      // Create a new JavaScript Date object based on the timestamp
      // multiplied by 1000 so that the argument is in milliseconds, not seconds.
      let months_arr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov',
         'Dec'
      ];
      let elementToStr = labels.timestamps[i].toString();
      let newElement = elementToStr.slice(0, 10);
      let date = new Date(parseInt(newElement) * 1000);

      let year = date.getFullYear();
      // Month
      let month = months_arr[date.getMonth()];
      // Day
      let day = date.getDate();
      // Hours part from the timestamp
      let hours = date.getHours();
      // Minutes part from the timestamp
      let minutes = "0" + date.getMinutes();
      // Seconds part from the timestamp
      let seconds = "0" + date.getSeconds();
      let time = month + ' ' + day + ' ' + hours + ':' + minutes;
      console.log(pricesCategory);
      xs.push(time);
      if (pricesCategory == 1) {
         prices = labels.prices_min[i];
      }
      if (pricesCategory == 2) {
         prices = labels.prices_avg[i];
      }
      if (pricesCategory == 3) {
         prices = labels.prices_max[i];
      }
      ys.push(prices);


   }
   return {
      xs,
      ys
   };
}

//Chart.js
async function chartIt() {

   const data = await getData();
   console.log(data);
   const ctx = document.getElementById('myChart').getContext('2d');
   var myChart = new Chart(ctx, {
      type: 'line',
      data: {
         labels: data.xs,
         datasets: [{
            label: 'Fine Cloth Data Market',
            data: data.ys,
            backgroundColor: 'rgba(191, 215, 255,1)',
            borderColor: 'rgba(66, 134, 244,1)',
            pointBackgroundColor: 'rgba(191, 215, 255,1)',
            pointHoverRadius: 5,
            pointHitRadius: 2,
            borderWidth: 3,
            pointRadius: 4,
            fill: true
         }]
      },
      options: {
         layout: {
            padding: {
               left: 20,
               right: 20,
               top: 20,
               bottom: 20
            }
         },
         responsive: true,
         maintainAspectRatio: false,

         scales: {
            yAxes: [{
               ticks: {
                  beginAtZero: false
               }
            }]
         }
      }
   })
   document.getElementById("submit").onclick = () => {
      myChart.destroy();
      chartIt();
   }
   document.getElementById("24hours").onclick = () => {
      timeLength = 12
      myChart.destroy();
      chartIt();
   }
   document.getElementById("7days").onclick = () => {
      timeLength = 84;
      myChart.destroy();
      chartIt();
   }
   document.getElementById("2weeks").onclick = () => {
      timeLength = 168;
      myChart.destroy();
      chartIt();
   }
   document.getElementById('min-prices').onclick = () => {
      pricesCategory = 1;
      myChart.destroy();
      chartIt();
   }
   document.getElementById('avg-prices').onclick = () => {
      pricesCategory = 2;
      myChart.destroy();
      chartIt();
   }
   document.getElementById('max-prices').onclick = () => {
      pricesCategory = 3;
      myChart.destroy();
      chartIt();
   }

   function removeData(chart) {
      chart.data.labels.pop();
      chart.data.datasets.forEach((dataset) => {
         dataset.data.pop();
      });
      chart.update();
   }
};
chartIt();
// end char.js