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
console.log(tokenName);

// Each token's info



// Declare global variables to store chart data
let dates = [];
let prices = [];
let volumes = [];
let addresses_count = [];


// Get data from file/api and store in global vars
async function loadData() {
  const res = await fetch("historical_data_" + info[tokenName].symbol + ".csv");
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

async function getTableData() {
  let data;
  const res = await fetch("https://data.messari.io/api/v1/assets/" + info[tokenName].symbol + "/metrics")  .then(res => res.json())
  .then(messariRes => data = messariRes.data)

  return data;
}


async function makeTableDataObj() {
  let data = await getTableData(); 
  let dataObj = {};
  dataObj["Current Price"] = "$" + data.market_data.price_usd.toLocaleString();

  try { 
    dataObj["Percent Change 1W"] = (data["roi_data"]["percent_change_last_1_week"].toLocaleString()[0] === '-') ? (data["roi_data"]["percent_change_last_1_week"].toLocaleString() + "%") : ('+' + data["roi_data"]["percent_change_last_1_week"].toLocaleString() + "%");

  dataObj["Percent Change 1M"] = (data["roi_data"]["percent_change_last_1_month"].toLocaleString()[0] === '-') ? (data["roi_data"]["percent_change_last_1_month"].toLocaleString() + "%") : ('+' + data["roi_data"]["percent_change_last_1_month"].toLocaleString() + "%");

    dataObj["Percent Change 3M"] = (data["roi_data"]["percent_change_last_3_months"].toLocaleString()[0] === '-') ? (data["roi_data"]["percent_change_last_3_months"].toLocaleString() + "%") : ('+' + data["roi_data"]["percent_change_last_3_months"].toLocaleString() + "%");

    dataObj["Percent Change 1Y"] = (data["roi_data"]["percent_change_last_1_year"].toLocaleString()[0] === '-') ? (data["roi_data"]["percent_change_last_1_year"].toLocaleString() + "%") : ('+' + data["roi_data"]["percent_change_last_1_year"].toLocaleString() + "%");
  }
    catch (error) {
  console.error(error);
  }

  try {
    dataObj["Active Addresses"] = data["on_chain_data"]["active_addresses"].toLocaleString();
    dataObj["Tx Volume Last 24h (USD)"] = '$' + data["on_chain_data"]["txn_volume_last_24_hours_usd"].toLocaleString();
  }
  catch (error) {
  console.error(error);
  }
  
  console.log("stat obj" + dataObj);
  return dataObj;
}

async function makeTable() {
  let obj = await makeTableDataObj();
  let a = [];
  for (let k in obj) {a.push(k)}
  let rev = a.reverse();
  console.log("REVERSE" + rev);
  var myTable = document.getElementById("statsTable");

    var table = document.createElement('Tb');
   
    var tableBody = document.createElement('Tbody');
    
    table.appendChild(tableBody);

    for (let el of rev) {
      var tr = document.createElement('tr');
      tableBody.appendChild(tr);
      var r = tableBody.insertRow(0);
      var c = r.insertCell(0);
      var c1 = r.insertCell(1);
      c.innerHTML = "<b>" + el + "</b>";
      c.style.width = '205px';
      c1.innerHTML = obj[el];
    }
     table.className = 'table_styling';
     myTable.appendChild(table);
  
}


function displayStats() {
  if (info.hasOwnProperty(tokenName)) {
    makeChart();
    makeTable();
  }
}

function setValue() {
  
  
  document.getElementById('statsTable').innerHTML = '';
  tokenName = document.getElementById("token").value;
  if (tokenName !== 'placeholder') {
    
    document.getElementById('name').innerHTML = tokenName;

    document.getElementById('table_title').innerHTML = 'Stats';

    document.getElementById('figs').innerHTML = 'Charts';
    displayStats();

    
  }
  
}




