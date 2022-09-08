// Get daily data from database


async function getDB() {
  const res = await fetch('/api');
  const data = await res.json();
  return data;
}



displayTables();

async function displayTables() {
  
  const projectsWithUsersData = ['uni', 'ens', 'looks', 'matic', 'zrx']
  let tokens = await getDB();
  console.log(tokens);
  
  tokens = sortTokens(tokens, 'percent_change_last_1_month');

  displayWatchlist(tokens);
  
  
}

async function changeCriterion(crit) {
  let tokens = await getDB();
  const projectsWithUsersData = ['uni', 'ens', 'looks', 'matic', 'zrx']
  const translate = {'Price': 'price_usd', 'Price Change 24h':'percent_change_usd_last_24_hours', 'Price Change 1M':'percent_change_last_1_month', 'Daily Users': 'users_count', 'Users Change 3M': 'users_percent_change_3m', 'Return Since Launch':'return_since_launch', 'TVL':'tvl'}
  
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





// Display watchlist table
async function displayWatchlist(tokens) {
  
  document.getElementById("watchlist").innerHTML = '';
  //tokens = tokens.reverse();
  console.log('length = ' + tokens.length);
  if (tokens.length > 0) {

    var parent = document.getElementById("watchlist");

    var title = document.createElement('h3');

    title.innerHTML = 'All tokens';
  
    parent.appendChild(title);
  
    var myTableDiv = document.createElement('div');
    
    parent.appendChild(myTableDiv);

    var table = document.createElement('TABLE');
    //table.border = '1';
    table.setAttribute('class', "table")
    var header = table.createTHead();
    header.setAttribute('class', "table-dark")
    var row = header.insertRow(0);
    header.setAttribute('class', 'th');
    var cell = row.insertCell(0);
    var cell1 = row.insertCell(1);
    var cell2 = row.insertCell(2);
    var cell3 = row.insertCell(3);
    var cell4 = row.insertCell(4);
    var cell5 = row.insertCell(5);
    var cell6 = row.insertCell(6);
    var cell7 = row.insertCell(7);
  
    cell.innerHTML = "<b>Rank</b>"
    cell1.innerHTML = "<b>Token</b>"
    cell2.innerHTML = "<b>Symbol</b>";
    cell3.innerHTML = "<b onclick='changeCriterion(this)' class='crit'>TVL</b>"
    cell4.innerHTML = "<b onclick='changeCriterion(this)' class='crit'>Price</b>";
    cell5.innerHTML = "<b onclick='changeCriterion(this)' class='crit'>Price Change 24h</b>";
    // cell4.innerHTML = "<b>Volume Change vs Average</b>";
    cell6.innerHTML = "<b onclick='changeCriterion(this)' class='crit'>Price Change 1M</b>";
    // cell5.innerHTML = "<b>Wallets Holding > $10</b>";
    cell7.innerHTML = "<b onclick='changeCriterion(this)' class='crit'>Return Since Launch</b>";



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
      var c7 = r.insertCell(7);
      // Add some text to the new cells:

      c.innerHTML = tokens.length - i;
        
      c1.innerHTML = `<a href=/projects/${tokens[i].symbol} class='link'> ${tokens[i].name} </a>`;

      c2.innerHTML = tokens[i].symbol.toUpperCase();

      let tvl = tokens[i].metrics.tvl

      if (typeof tvl === 'number') {
        c3.innerHTML = tvl > 1000000000 ? Math.round(tvl/100000000)/10 + 'B' : Math.round(tvl/100000)/10 + 'M';
          }
      else {
        c3.innerHTML = "<span>-</span>"
      }

      
      
      c4.innerHTML = "$" + Math.round(Number(tokens[i].metrics.price_usd) * 100) / 100;

        let change24 = Number(tokens[i].metrics.percent_change_usd_last_24_hours)
      
      if (typeof tokens[i].metrics.percent_change_usd_last_24_hours === 'undefined') {c5.innerHTML = 'no data'}
      else {
        c5.innerHTML = (change24 <= 0) ? (`<span style='color:FireBrick'> ${Math.round(change24 * 100) / 100}% </span>`) : (`<span style='color:green'> +${Math.round(change24 * 100) / 100}% </span>`);
      }

      let change1M = Number(tokens[i].metrics.percent_change_last_1_month)
      
      if (typeof tokens[i].metrics.percent_change_last_1_month === 'undefined') {c6.innerHTML = 'no data'}
      else {
        c6.innerHTML = (change1M <= 0) ? 
(`<span style='color:FireBrick'> ${Math.round(change1M * 100) / 100}% </span>`) : (`<span style='color:green'> +${Math.round(change1M * 100) / 100}% </span>`);
      }

      if (typeof tokens[i].metrics.launch_price === 'undefined') {c7.innerHTML = 'no data'}
      else {
        //let launchPrice = tokens[i].metrics.launch_price;
        
        // let change = Math.round(((Number(tokens[i].metrics.price_usd) / launchPrice) - 1 ) * 100); 
        c7.innerHTML = (tokens[i].metrics.return_since_launch <= 0) ? 
(`<span style='color:FireBrick'> ${tokens[i].metrics.return_since_launch}% </span>`) : (`<span style='color:green'> +${tokens[i].metrics.return_since_launch}% </span>`);
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


