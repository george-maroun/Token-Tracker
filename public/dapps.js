// Get daily data from database


async function getDB() {
  const res = await fetch('/api');
  const data = await res.json();
  return data;
}


displayTables();

async function displayTables() {
  document.getElementById('dapps').innerHTML = 'Loading data...';
  const projectsWithUsersData = ['uni', 'ens', 'looks', 'matic', 'zrx']
  let tokens = await getDB();
  console.log(tokens);
  
  tokens = sortTokens(tokens, 'percent_change_last_1_month');

    document.getElementById('watchlist').innerHTML = ''; 
  
  let dapps = await populateDapps(projectsWithUsersData, tokens);
  console.log(dapps);
  sortedDapps = sortTokens(dapps, 'users_count');
  makeDappsTable(sortedDapps, tokens);

  
}

async function changeCriterion(crit) {
  let tokens = await getDB();
  const projectsWithUsersData = ['uni', 'ens', 'looks', 'matic', 'zrx']
  const translate = {'Price': 'price_usd', 'Price Change 24h':'percent_change_usd_last_24_hours', 'Price Change 1M':'percent_change_last_1_month', 'Daily Users': 'users_count', 'Users Change 3M': 'users_percent_change_3m', 'Return Since Launch':'return_since_launch'}
  
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
  crit.style.textDecoration = "underline !important";
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
 
  var parent = document.getElementById("dapps");

  parent.innerHTML = '';

  var title = document.createElement('h2');

  title.innerHTML = 'Users';

  parent.appendChild(title);

  var myTableDiv = document.createElement('div');

  
  parent.appendChild(myTableDiv);

  var table = document.createElement('TABLE');
  table.border = '1';
   
  var header = table.createTHead();
  header.setAttribute('class', 'th');
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



