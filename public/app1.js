// Was chart already created bool
let chartCreated = false;

// Charts variables
let price_chart;
let users_chart;

// Hide table
// const tabl = document.getElementById('tabl');
// tabl.style.visibility = 'hidden';

// Get token name 
let tokenName = document.getElementById("token").value;
// console.log(tokenName);
//let tokenName = 'Bitcoin';

// get db
async function getDB() {
  const res = await fetch('/api');
  const data = await res.json();
  return data;
}

function findToken(arr) {
  for (let token of arr) {
    if (token.name === tokenName) {
      return token; 
    }
  }
  return;
}

const info = {};

// Declare global variables to store chart data
let dates = [];
let prices = [];
let volumes = [];
let addresses_count = [];


// Get data from file/api and store in global vars
async function loadData() {
  // get database
  const db = await getDB();
  // get token object
  const tokenObj = findToken(db);

  let metrics
  try {
    metrics = tokenObj.metrics;
  }
  catch {
    return;
  }
  info[tokenName] = {};
  // for each metric in metrics
  for (let metric in metrics) {
    
    
    let res;
    try {
      res = await fetch("historical_data/" + tokenObj.symbol + "/" + metric + ".csv");
    
    //console.log(metric);
    const text = await res.text();
  // historical_data_btc.csv
  
    const first = text.split('\n').slice(0, 1);
    const table = text.split('\n').slice(1);
    //console.log(rows);
    const firstRow = first.toString().split(',');
    console.log('first row ! ' + firstRow);
    let dates = firstRow[0].replaceAll('"', '');
    let y = firstRow[1].replaceAll('"', '');
    info[tokenName][metric] = {};
    info[tokenName][metric][dates] = [];
    info[tokenName][metric][y] = [];
    for (let j = 0; j < table.length; j++) {
      const row = table[j].split(',');
      
      info[tokenName][metric][dates].push(row[0].replaceAll('"', ''));
      info[tokenName][metric][y].push(row[1].replaceAll('"', ''));
      }
    }
    catch {
      console.log('not' + metric);
    }
 
      
     


    
  
  // try to get the csv 
  
  }
  
  console.log(info);
}

loadData();


// Assign chart parameters

function assignChartData(y) {
const labels = info[tokenName].price_usd["Date"].splice(900);

  y_data = {
    labels: labels,
    datasets: [{
      label: y,
      backgroundColor: 'RoyalBlue',
      borderColor: 'RoyalBlue',
      borderWidth: 2,
      data: info[tokenName].price_usd["Price (Close)"].splice(900),
      fill: false,
      pointRadius: 0,
      tension: 0.1
    }]
  };
  return y_data;
}

  function config_chart(data_arr) {
    return {
      type: 'line',
      data: data_arr,
      options: {
        plugins: {
          legend: {
            display: true,
            font: {
              family: "monospace"
            },
            labels: {
              boxWidth: 40
            }
          }
          
        }
      }
    };
  }


// Make chart once data is obtained
async function makeChart() {

  await loadData();
  
  
  document.getElementById('usersChart').style.visibility = 'visible';
  //console.log(prices, dates);
  
  //await getData();

  //console.log(prices);
  let price_data = assignChartData("Price (Close)");
  console.log(price_data);
  let users_data;
  if (info[tokenName].hasOwnProperty("Addresses with balance greater than $1")) {
      users_data = assignChartData("Addresses with balance greater than $1");
  }

  if (!chartCreated) {
    price_chart = new Chart(
      document.getElementById('priceChart'),
      config_chart(price_data)
    );

    if (users_data) {
      users_chart = new Chart(
        document.getElementById('usersChart'),
        config_chart(users_data)
      );
    }
  
    chartCreated = true;
      
  }
  else {
    //console.log("updated!!!!!")
    price_chart.data = price_data;
    price_chart.update();

    if (users_data) {
      users_chart.update();
    }
    else {
      document.getElementById('usersChart').style.visibility = 'hidden';
    }
  }

}



function displayStats() {
  makeChart();
    //makeTable();
  
}

function setValue() {
  
  
  document.getElementById('statsTable').innerHTML = '';
  tokenName = document.getElementById("token").value;
  if (tokenName !== 'placeholder') {
    
    document.getElementById('name').innerHTML = tokenName;

    // document.getElementById('table_title').innerHTML = 'Stats';

    document.getElementById('figs').innerHTML = 'Charts';
    displayStats();

    
  }
  
}




