// Get daily data from database


async function getDB() {
  const res = await fetch('/api');
  const data = await res.json();
  return data;
}



async function displayTables() {
  document.getElementById("dapps").innerHTML = 'loading data...'
  const projectsWithUsersData = ['uni', 'ens', 'looks', 'matic', 'zrx']
  let tokens = await getDB();
  //console.log(tokens);
  
  tokens = sortTokens(tokens, 'percent_change_last_1_month');

  displayWatchlist(tokens);
  let dapps = await populateDapps(projectsWithUsersData, tokens);
  console.log(dapps);
  sortedDapps = sortTokens(dapps, 'users_count');
  makeDappsTable(sortedDapps, tokens);
  //console.log(getUsers3M(dapps, 'uni'))
  
}

async function changeCriterion(crit) {
  let tokens = await getDB();
  const projectsWithUsersData = ['uni', 'ens', 'looks', 'matic', 'zrx']
  const translate = {'Price': 'price_usd', 'Price Change 24h':'percent_change_usd_last_24_hours', 'Price Change 1M':'percent_change_last_1_month', 'Daily Users': 'users_count', 'Users Change 3M': 'users_percent_change_3m'}
  
  let criterionRaw = crit.innerHTML;
  console.log(criterionRaw);

  let criterion = translate[criterionRaw];
  console.log(criterion);
  if (criterionRaw === 'Daily Users' || criterionRaw === 'Users Change 3M') {
    const dapps = await populateDapps(projectsWithUsersData, tokens);
    let sortedTokens = sortTokens(dapps, criterion);
    makeDappsTable(dapps, sortedTokens);
  }
  else {
    let sortedTokens = sortTokens(tokens, criterion);
    displayWatchlist(sortedTokens);
  }
  crit.style.textDecoration = "underline";
}


function sortTokens(tokens, criterion) {
  tokens.sort(function(a, b) {
    if (a.metrics && b.metrics) {
      if ( Number(a.metrics[criterion]) > Number(b.metrics[criterion]) ){
      
        return 1;
      }
      if ( Number(a.metrics[criterion]) < Number(b.metrics[criterion]) ){
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
  return tokens;
}



async function makeDappsTable(dapps) {
 
  var myTableDiv = document.getElementById("dapps");

  

  var table = document.createElement('TABLE');
  table.border = '1';
   
  var header = table.createTHead();
  var row = header.insertRow(0);
  var cell = row.insertCell(0);
  var cell1 = row.insertCell(1);
  var cell2 = row.insertCell(2);
  var cell3 = row.insertCell(3);
  var cell4 = row.insertCell(4);
  // var cell5 = row.insertCell(5);
  cell.innerHTML = "<b>Rank</b>"
  cell1.innerHTML = "<b>Name</b>"
  cell2.innerHTML = "<b>Category</b>";
  cell3.innerHTML = "<b onclick='changeCriterion(this)' class='crit'>Daily Users</b>";
  cell4.innerHTML = "<b onclick='changeCriterion(this)' class='crit'>Users Change 3M</b>";
  
    
  
  //cell4.innerHTML = "<b>Price Change 1M</b>";
  // cell5.innerHTML = "<b>Wallets Holding > $10</b>";




  var tableBody = document.createElement('TBODY');
  table.appendChild(tableBody);

  let rank = Object.keys(dapps).length;
  
  for (let dapp of dapps) {  
    var tr = document.createElement('TR');
    tableBody.appendChild(tr);

    var r = tableBody.insertRow(0);

    // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
    var c = r.insertCell(0);
    var c1 = r.insertCell(1);
    var c2 = r.insertCell(2);
    var c3 = r.insertCell(3);
    var c4 = r.insertCell(4);
    // var c5 = r.insertCell(5);
    // Add some text to the new cells:
    c.innerHTML = rank;
    
    c1.innerHTML = `<a href=/projects/${dapp.symbol} class='link'> ${dapp.name} </a>`;
    

    c2.innerHTML = dapp.sector;

    c3.innerHTML = dapp.metrics.users_count;

    let percentChange = dapp.metrics.users_percent_change_3m;

    c4.innerHTML = percentChange < 0 ? `<span style="color:FireBrick"> ${percentChange.toString()}% </span>` : `<span style="color:green"> +${percentChange.toString()}%</span>`;
    rank--;
  
  
  }

  myTableDiv.innerHTML = '';
  
  myTableDiv.appendChild(table);
}


function getCurrentUsers(dapp) {
  //console.log(dapp)
  let lastSeven = dapp.historical["Users"].slice(dapp.historical["Users"].length - 8);
  let sum = lastSeven.reduce((partialSum, a) => partialSum + Number(a), 0);
  //console.log(sum);
  return sum/8;
}

function getUsers3M(dapp) {
  let len = dapp.historical["Users"].length;
  let lastSeven = dapp.historical["Users"].slice(len - 98, len - 90);
  //console.log(lastSeven);
  let sum = lastSeven.reduce((partialSum, a) => partialSum + Number(a), 0);
  
  return sum/8;
}




async function populateDapps(projects, all) {

  const dapps = [];
  for (let token of all) {
    if (projects.includes(token.symbol)) {
      dapps.push(token);
    }
  }  
  //console.log(dapps);
  
  for (let dapp of dapps) {
    dapp['historical'] = {};
    const res = await fetch("historical_data/" + dapp.symbol + "/users.csv");
    const text = await res.text();
    
    const first = text.split('\n').slice(0, 1);
    const table = text.split('\n').slice(1);
    const firstRow = first.toString().split(',');
    
    for (let i = 1; i < firstRow.length; i++) {
      
      dapp['historical'][firstRow[i]] = [];
      
      for (let j = 0; j < table.length; j++) {
        const row = table[j].split(',');
        dapp['historical'][firstRow[i]].push(row[i]);
      
      }
    }

    let usersCurrent = getCurrentUsers(dapp);

    dapp.metrics['users_count'] = Math.round(usersCurrent);
    
    let users3M = getUsers3M(dapp);

    dapp.metrics['users_percent_change_3m'] = Math.round((usersCurrent/users3M - 1) *100)
    //console.log(dapp);
      
  }
  
      
  
  return dapps;
}
//


// NOT USING
// Calculate a token's past month avg volume
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

// NOT USING
// Add average volume over last month to token obj
async function populateVol() {
  for (let token in tokens) {
    let avg = await getAvgVolume(token);
    tokens[token]["avg_vol"] = avg;
  }
  //console.log(tokens);
}



// Display watchlist table
async function displayWatchlist(tokens) {
  document.getElementById("watchlist").innerHTML = 'Loading data...';
  //let movers = await getTokensArr();
 

//   tokens.sort(function(a, b) {
//     if (a.metrics && b.metrics) {
//       if ( Number(a.metrics.percent_change_last_1_month) > Number(b.metrics.percent_change_last_1_month) ){
        
//         return 1;
//       }
//       if ( Number(a.metrics.percent_change_last_1_month) < Number(b.metrics.percent_change_last_1_month) ){
//         return -1;
//       }
//     }
//     else if (a.metrics) {
//       return 1;
//     }
//     else if (b.metrics) {
//       return -1;
//     }
//     else {
//       if ( a.name > b.name ){
//       return -1;
//       }
//       if ( a.name < b.name ){
//         return 1;
//       }
//     }
// });
  
  document.getElementById("watchlist").innerHTML = '';
  //tokens = tokens.reverse();
  console.log('length = ' + tokens.length);
  if (tokens.length > 0) {

    var myTableDiv = document.getElementById("watchlist");

    var table = document.createElement('TABLE');
    table.border = '1';
     
    var header = table.createTHead();
    var row = header.insertRow(0);
    var cell = row.insertCell(0);
    var cell1 = row.insertCell(1);
    var cell2 = row.insertCell(2);
    var cell3 = row.insertCell(3);
    var cell4 = row.insertCell(4);
    var cell5 = row.insertCell(5);
    var cell6 = row.insertCell(6);
    cell.innerHTML = "<b>Rank</b>"
    cell1.innerHTML = "<b>Token</b>"
    cell2.innerHTML = "<b>Symbol</b>";
    cell3.innerHTML = "<b onclick='changeCriterion(this)' class='crit'>Price</b>";
    cell4.innerHTML = "<b onclick='changeCriterion(this)' class='crit'>Price Change 24h</b>";
    // cell4.innerHTML = "<b>Volume Change vs Average</b>";
    cell5.innerHTML = "<b onclick='changeCriterion(this)' class='crit'>Price Change 1M</b>";
    // cell5.innerHTML = "<b>Wallets Holding > $10</b>";
    cell6.innerHTML = "<b onclick='changeCriterion(this)' class='crit'>Return Since Launch</b>";



    var tableBody = document.createElement('TBODY');
    table.appendChild(tableBody);
  
    for (var i = 0; i < tokens.length; i++) {

      if (tokens[i].metrics.price_usd) {
        
      var tr = document.createElement('TR');
      tableBody.appendChild(tr);

      var r = tableBody.insertRow(0);

      // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
      var c = r.insertCell(0);
      var c1 = r.insertCell(1);
      var c2 = r.insertCell(2);
      var c3 = r.insertCell(3);
      var c4 = r.insertCell(4);
      var c5 = r.insertCell(5);
      var c6 = r.insertCell(6);
      // Add some text to the new cells:

      c.innerHTML = 36 - i;
        
      c1.innerHTML = `<a href=/projects/${tokens[i].symbol} class='link'> ${tokens[i].name} </a>`;

      c2.innerHTML = tokens[i].symbol;
      
      c3.innerHTML = "$" + tokens[i].metrics.price_usd;

      
      if (typeof tokens[i].metrics.percent_change_usd_last_24_hours === 'undefined') {c3.innerHTML = 'no data'}
      else {
        c4.innerHTML = (tokens[i].metrics.percent_change_usd_last_24_hours <= 0) ? (`<span style='color:FireBrick'> ${tokens[i].metrics.percent_change_usd_last_24_hours}% </span>`) : (`<span style='color:green'> +${tokens[i].metrics.percent_change_usd_last_24_hours}% </span>`);
      }
      
      if (typeof tokens[i].metrics.percent_change_last_1_month === 'undefined') {c5.innerHTML = 'no data'}
      else {
        c5.innerHTML = (tokens[i].metrics.percent_change_last_1_month <= 0) ? 
(`<span style='color:FireBrick'> ${tokens[i].metrics.percent_change_last_1_month}% </span>`) : (`<span style='color:green'> +${tokens[i].metrics.percent_change_last_1_month}% </span>`);
      }

      if (typeof tokens[i].metrics.launch_price === 'undefined') {c6.innerHTML = 'no data'}
      else {
        let launchPrice = tokens[i].metrics.launch_price;
        
        let change = Math.round(((Number(tokens[i].metrics.price_usd) / launchPrice) - 1 ) * 100); 
        c6.innerHTML = (change <= 0) ? 
(`<span style='color:FireBrick'> ${change}% </span>`) : (`<span style='color:green'> +${change}% </span>`);
      }
        
        // if (tokens[i].metrics.addresses_balance_greater_10_usd_count){
        //   c5.innerHTML = tokens[i].metrics.addresses_balance_greater_10_usd_count;
        // }
        // else {
        //   c5.innerHTML = 'no data';
        // }
        

        
    
      
      
      
      // c4.innerHTML = (Math.floor(tokens[movers[i]].vol_change_last_24h) > 0) ? ('+' + Math.floor(tokens[movers[i]].vol_change_last_24h) + '%') : (Math.floor(tokens[movers[i]].vol_change_last_24h) + '%');

    //table.className = 'table_styling';
    myTableDiv.appendChild(table);
    }
  }
  }

  else {
    document.getElementById('watchlist').innerHTML = "No big moves today";
  }
  
}


