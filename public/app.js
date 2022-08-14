// Was chart already created bool
let chartCreated = false;

// Charts variables
let price_chart;
let users_chart;

// Hide table
const tabl = document.getElementById('tabl');
tabl.style.visibility = 'hidden';

// Get token name 
let tokenName = document.getElementById("token").value;
console.log(tokenName);

// Each token's info
const info = {
  Bitcoin: {
    symbol: "btc"
  },
  Ethereum: {
    symbol: "eth"
  },
  Solana: {
    symbol: "sol"
  }, 
  LidoDAO: {
    symbol: "ldo"
  },
  Polygon: {
    symbol: "matic"
  },
  Uniswap: {
    symbol: "uni"
  },
  Sushiswap: {
    symbol: "sushi"
  },
  Curve: {
    symbol: "crv"
  },
  Synthetix: {
    symbol: "snx"
  },
  THORChain: {
    symbol: "rune"
  }
}


// Declare global variables to store chart data
let dates = [];
let prices = [];
let volumes = [];
let addresses_count = [];


// Get data from file/api and store in global vars
async function loadData() {
  const res = await fetch("data/historical_data_" + info[tokenName].symbol + ".csv");
  const text = await res.text();
  // historical_data_btc.csv
  
  const first = text.split('\n').slice(0, 1);
  const table = text.split('\n').slice(1);
  //console.log(rows);
  const firstRow = first.toString().split(',');
  //console.log('first row ! ' + firstRow);
  for (let i = 0; i < firstRow.length; i++) {
    let metric = firstRow[i].replaceAll('"', '');
    info[tokenName][metric] = [];
    for (let j = 0; j < table.length; j++) {
      const row = table[j].split(',');
      //console.log(row);
      if (row[3] !== '""') {
        info[tokenName][metric].push(row[i].replaceAll('"', ''));
      }
      
    }
  } 
  console.log(info);
}



async function getData() {
  const res = await fetch("https://data.messari.io/api/v1/assets/" + info[tokenName].symbol + "/metrics")  .then(res => res.json())
  .then(messariRes => messariRes.data)
  .then(
    payload => { prices.push(payload.market_data.price_usd.toLocaleString().replaceAll(',', ''));
       addresses_count.push(payload.on_chain_data.addresses_balance_greater_1_usd_count.toLocaleString().replaceAll(',', ''));         
    })
  dates.push(new Date().toISOString().slice(0, 10));
  
}

// Assign chart parameters

function assignChartData(y) {
const labels = info[tokenName]["Date"];

  y_data = {
    labels: labels,
    datasets: [{
      label: y,
      backgroundColor: 'RoyalBlue',
      borderColor: 'RoyalBlue',
      borderWidth: 2,
      data: info[tokenName][y],
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

  if (!info[tokenName]["Price (Close)"]) {
    await loadData();
  }
  
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
  if (info.hasOwnProperty(tokenName)) {
  makeChart();
  //setInterval(() => makeChart(), 5000);
  
  window
    .fetch("https://data.messari.io/api/v1/assets/" + info[tokenName].symbol + "/metrics")
    .then(res => res.json())
    .then(messariRes => messariRes.data)
    .then(
      payload => {
        (document.getElementById("current-token-price").innerHTML = payload.market_data.price_usd.toLocaleString());

        if (payload.on_chain_data.addresses_balance_greater_1_usd_count) {
        (document.getElementById("current-token-addresses").innerHTML = payload.on_chain_data.addresses_balance_greater_1_usd_count.toLocaleString());
        }
        else {
          document.getElementById("current-token-addresses").innerHTML = ' -';
        }
      }
    );
  }
}

function setValue() {
  tokenName = document.getElementById("token").value;
  if (tokenName !== 'placeholder') {
    tabl.style.visibility = 'visible';

    
    document.getElementById('name').innerHTML = tokenName;

    document.getElementById('table_title').innerHTML = 'Token stats';
    document.getElementById('currPrice').innerHTML = 'Current price';
    document.getElementById('currAdd').innerHTML = 'Addresses holding > $1';

    document.getElementById('figs').innerHTML = 'Charts';
    displayStats();
  }
}




