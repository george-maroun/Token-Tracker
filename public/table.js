// Get daily data from database
async function getDB() {
  const res = await fetch('/api');
  const data = await res.json();
  return data;
}



async function getPastMonthVol(token) {
  let past_month_vol = [];
  
  const res = await fetch("data/historical_data_" + tokens[token].symbol + ".csv");
  const text = await res.text();
  
  const table = text.split('\n').slice(1);
  //console.log(rows);
  for (let i = 0; i < table.length; i++) {
    const row = table[i].split(',');
    //console.log(row[1]);
    const volume = row[2].replaceAll('"', '');
    past_month_vol[i] = volume;
    //console.log(date, price, add_count);
  
  }
  //past_month_vol = past_month_vol.reverse();
  
  //console.log(dates, prices, addresses_count);
  
  return past_month_vol;
}

async function getAvgVolume(token) {
  let vol = await getPastMonthVol(token);
  vol = vol.slice(0, 29);

  //console.log('volumes ' + vol);
  let sum = BigInt(0);
  vol.forEach(el => {
    sum += BigInt(Math.floor(el));
  });
  return sum/29n;
}

// Add average volume over last month to token obj
async function populateVol() {
  for (let token in tokens) {
    let avg = await getAvgVolume(token);
    tokens[token]["avg_vol"] = avg;
  }
  //console.log(tokens);
}




async function displayMovers() {
  document.getElementById("movers").innerHTML = 'Loading data...';
  //let movers = await getTokensArr();
  let tokens = await getDB();

  tokens.sort(function(a, b) {
    if (a.metrics && b.metrics) {
      if ( Number(a.metrics.percent_change_last_1_month) > Number(b.metrics.percent_change_last_1_month) ){
        
        return 1;
      }
      if ( Number(a.metrics.percent_change_last_1_month) < Number(b.metrics.percent_change_last_1_month) ){
        return -1;
      }
    }
    else if (a.metrics) {
      return 1;
    }
    else if (b.metrics) {
      return -1;
    }
    else {
      if ( a.name > b.name ){
      return -1;
      }
      if ( a.name < b.name ){
        return 1;
      }
    }
});
  
  document.getElementById("movers").innerHTML = '';
  //tokens = tokens.reverse();
  console.log('length = ' + tokens.length);
  if (tokens.length > 0) {

    var myTableDiv = document.getElementById("movers");

    var table = document.createElement('TABLE');
    table.border = '1';
     
    var header = table.createTHead();
    var row = header.insertRow(0);
    var cell = row.insertCell(0);
    var cell1 = row.insertCell(1);
    var cell2 = row.insertCell(2);
    var cell3 = row.insertCell(3);
    var cell4 = row.insertCell(4);
    cell.innerHTML = "<b>Token</b>"
    cell1.innerHTML = "<b>Symbol</b>";
    cell2.innerHTML = "<b>Price</b>";
    cell3.innerHTML = "<b>Price Change 24h</b>";
    // cell4.innerHTML = "<b>Volume Change vs Average</b>";
    cell4.innerHTML = "<b>Price Change 1M</b>";




    var tableBody = document.createElement('TBODY');
    table.appendChild(tableBody);
  
    for (var i = 0; i < tokens.length; i++) {

      if (tokens[i].metrics) {
        
      var tr = document.createElement('TR');
      tableBody.appendChild(tr);

      var r = tableBody.insertRow(0);

      // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
      var c = r.insertCell(0);
      var c1 = r.insertCell(1);
      var c2 = r.insertCell(2);
      var c3 = r.insertCell(3);
      var c4 = r.insertCell(4);
      
      // Add some text to the new cells:
      c.innerHTML = `<a href=projects/${tokens[i].symbol} class='link'> ${tokens[i].name} </a>`;

      c1.innerHTML = tokens[i].symbol;
      
      c2.innerHTML = "$" + tokens[i].metrics.price_usd;

      
      if (typeof tokens[i].metrics.percent_change_usd_last_24_hours === 'undefined') {c3.innerHTML = 'no data'}
      else {
        c3.innerHTML = (tokens[i].metrics.percent_change_usd_last_24_hours > 0) ? ('+' + tokens[i].metrics.percent_change_usd_last_24_hours + '%') : (tokens[i].metrics.percent_change_usd_last_24_hours + '%');
      }
      
        if (typeof tokens[i].metrics.percent_change_last_1_month === 'undefined') {c4.innerHTML = 'no data'}
      else {
        c4.innerHTML = (tokens[i].metrics.percent_change_last_1_month > 0) ? ('+' + tokens[i].metrics.percent_change_last_1_month + '%') : (tokens[i].metrics.percent_change_last_1_month + '%');
      }
      
      
      
      // c4.innerHTML = (Math.floor(tokens[movers[i]].vol_change_last_24h) > 0) ? ('+' + Math.floor(tokens[movers[i]].vol_change_last_24h) + '%') : (Math.floor(tokens[movers[i]].vol_change_last_24h) + '%');

    //table.className = 'table_styling';
    myTableDiv.appendChild(table);
    }
  }
  }

  else {
    document.getElementById('movers').innerHTML = "No big moves today";
  }
  
}