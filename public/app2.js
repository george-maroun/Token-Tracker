let sym = document.getElementById('symbol').innerHTML;
console.log(sym);

let tokenName;

let data; 

// get db
async function getDB() {
  const res = await fetch('/api');
  data = await res.json();
}

async function findToken() {
  await getDB();
  for (let token of data) {
    if (token.symbol === sym) {
      //console.log(token)
      return token; 
    }
  }
  return;
}
//findToken();
const info = {};


// Get data from file/api and store in global vars
async function loadData() {
  // get database
  //const db = await getDB();
  // get token object
  const tokenObj = await findToken();
  console.log(tokenObj);
  let metrics;
  try {
    metrics = tokenObj.metrics;
  }
  catch {
    document.getElementById('name').innerHTML = 'no chart data';
  }
  tokenName = tokenObj.name;
  
  info[sym] = {name: tokenName};
  document.getElementById('name').innerHTML = tokenName;
  // for each metric in metrics
  for (let metric in metrics) {
    
    
    let res;
    try {
      res = await fetch("historical_data/" + sym + "/" + metric + ".csv");
    
    //console.log(metric);
    const text = await res.text();
  // historical_data_btc.csv
  
    const first = text.split('\n').slice(0, 1);
    const table = text.split('\n').slice(1);
    //console.log(rows);
    const firstRow = first.toString().split(',');
    //console.log('first row ! ' + firstRow);
    let dates = firstRow[0].replaceAll('"', '');
    let y = firstRow[1].replaceAll('"', '');
    info[sym][metric] = {};
    info[sym][metric][dates] = [];
    info[sym][metric][y] = [];
    for (let j = 0; j < table.length; j++) {
      const row = table[j].split(',');
      
      info[sym][metric][dates].push(row[0].replaceAll('"', ''));
      info[sym][metric][y].push(row[1].replaceAll('"', ''));
      }
    }
    catch {
      console.log('not' + metric);
    }
 
      
     


    
  
  // try to get the csv 
  
  }
  
  console.log(info);
}

//loadData();


// Assign chart parameters

function assignChartData(y) {
  const labels = info[sym][y]["Date"];
  let xy = info[sym][y];

  let xy_data = {
    labels: labels,
    datasets: [{
      label: y,
      backgroundColor: 'RoyalBlue',
      borderColor: 'RoyalBlue',
      borderWidth: 2,
      data: Object.values(xy)[1],
      fill: false,
      pointRadius: 0,
      tension: 0.1
    }]
  };
  return xy_data;
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




async function makeChart() {

  await loadData();

  for (let metric in info[sym]) {
    if (metric !== 'name') {
      let chart_data = assignChartData(metric);
  
      //if (!chartCreated) {
      metric_chart = new Chart(
        document.getElementById(metric),
        config_chart(chart_data)
      );
    }
    //chartCreated = true; 
   // }
 //    else {
 //      metric_chart.data = price_data;
 //      price_chart.update();
 //      if (users_data) {
 //        users_chart.update();
 //      }
 //      else {
 // document.getElementById('usersChart').style.visibility = 'hidden';
 //      }
    }
}


async function makeTable() {
  const obj = await findToken();
  let a = [];
  for (let k in obj.metrics) {a.push(k)}
  
  let rev = a.reverse();
  console.log("REVERSE" + rev);
  var myTable = document.getElementById("statsTable");

    var table = document.createElement('Tb');
   
    var tableBody = document.createElement('Tbody');
    
    table.appendChild(tableBody);

    for (let el of rev) {
      //console.log(works);
      var tr = document.createElement('tr');
      tableBody.appendChild(tr);
      var r = tableBody.insertRow(0);
      var c = r.insertCell(0);
      var c1 = r.insertCell(1);
      let stat = el.replaceAll('_', ' ');
      c.innerHTML = "<b>" + stat.charAt(0).toUpperCase() + stat.slice(1); + "</b>";
      c.style.width = '235px';
      if (el === 'price_usd') {
        c1.innerHTML = '$' + obj.metrics[el];
      }
      else if (el.includes('percent')) {
        if (Number(obj.metrics[el]) > 0) {
          c1.innerHTML = '+' + obj.metrics[el] + '%';
        }
        else {
          c1.innerHTML = obj.metrics[el] + '%';
        }
      }
      else {
        c1.innerHTML = obj.metrics[el];
      }
    }
     table.className = 'table_styling';
     myTable.appendChild(table);
  
}



async function displayStats() {
  await makeChart();
  makeTable();
}

function setValue() {

  document.getElementById('table_title').innerHTML = 'Stats';
    document.getElementById('figs').innerHTML = 'Charts';
    displayStats();
}

setValue()


