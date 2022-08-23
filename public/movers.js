// Declare object to store tokens
const tokens = {
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


async function getDB() {
  const res = await fetch('/api');
  const data = await res.json();
  return data;
}
getDB();





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



// Get daily data for a token
async function getTodayData(token) {
  let data;
  const res = await fetch("https://data.messari.io/api/v1/assets/" + tokens[token].symbol + "/metrics")  .then(res => res.json())
  .then(messariRes => data = messariRes.data)

  return data;
}


// Add 24h data to tokens obj
async function populate24hChange() {
  await populateVol();
  //const db = await getDB();

  // SORT ARRAY
  // token is an object
  for (let token in db) {
    // get today data for token
    //let tokenData = allData;
    //console.log(today);

      let today_vol = today["market_data"]["real_volume_last_24_hours"].toLocaleString().replaceAll(',', '');
    let price_change;
    
    let daily_price = today["market_data"]["price_usd"].toLocaleString().replaceAll(',', '');
   
    let change_vol = (today_vol / Number(tokens[token].avg_vol) - 1) * 100;
    //console.log(token + ' volume change last 24h ' + change_vol);
    tokens[token]["vol_change_last_24h"] = change_vol;
    
    tokens[token]["daily_price"] = daily_price;

    try {
    price_change = today["market_data"]["percent_change_usd_last_24_hours"].toLocaleString().replaceAll(',', '');
    }
    catch {
      continue;
    }

    tokens[token]["price_change_last_24h"] = price_change;
    
  } 
}


// Create an array containing names of tokens on watchlist
async function getTokensArr() {
  await populate24hChange();
  //console.log(tokens);
  let movers = [];

  for (let token in tokens) {
    // tokens[token]["vol_change_last_24h"] > -20 
    // if (tokens[token]["vol_change_last_24h"] > 20 && tokens[token]["price_change_last_24h"] > 0) {
      movers.push(token);
    //}
  }
  return movers;
}


async function displayMovers() {
  document.getElementById("movers").innerHTML = 'Loading data...';
  //let movers = await getTokensArr();
  let tokens = await getDB();
  document.getElementById("movers").innerHTML = '';
  tokens = tokens.reverse()
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
    cell3.innerHTML = "<b>Price Change</b>";
    cell4.innerHTML = "<b>Volume Change vs Average</b>";




    var tableBody = document.createElement('TBODY');
    table.appendChild(tableBody);
  
    for (var i = 0; i < movers.length; i++) {
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
      c.innerHTML = movers[i];

      c1.innerHTML = tokens[movers[i]].symbol;
      
      c2.innerHTML = "$" + tokens[movers[i]].daily_price;

      
      if (typeof tokens[movers[i]].price_change_last_24h === 'undefined') {c3.innerHTML = 'no data'}
      else {
        c3.innerHTML = (tokens[movers[i]].price_change_last_24h > 0) ? ('+' + tokens[movers[i]].price_change_last_24h + '%') : (tokens[movers[i]].price_change_last_24h + '%');
      }
      
      
      
      
      c4.innerHTML = (Math.floor(tokens[movers[i]].vol_change_last_24h) > 0) ? ('+' + Math.floor(tokens[movers[i]].vol_change_last_24h) + '%') : (Math.floor(tokens[movers[i]].vol_change_last_24h) + '%');

    //table.className = 'table_styling';
    myTableDiv.appendChild(table);
    
  }
  }

  else {
    document.getElementById('movers').innerHTML = "No big moves today";
  }
  
}