// Get daily data from database


async function getDB() {
  const res = await fetch('/api');
  const data = await res.json();
  return data;
}


//displayTables();

// async function displayTables() {
  
//   const projectsWithUsersData = ['uni', 'ens', 'looks', 'matic', 'zrx']
//   let tokens = await getDB();
//   console.log(tokens);
  
//   tokens = sortTokens(tokens, 'percent_change_last_1_month');
//   makeAllTables(tokens);
  
// }

async function displayAll() {
  
  const projectsWithUsersData = ['uni', 'ens', 'looks', 'matic', 'zrx']
  let tokens = await getDB();
  console.log(tokens);
  
  tokens = sortTokens(tokens, 'percent_change_last_1_month');

  tokens.sort(function(a, b) {
      return a.metrics.return_since_launch - b.metrics.return_since_launch;
    });
  
  //makeAllTables(tokens);
  document.getElementById('tables').innerHTML = '';
  makeAllProjectsTable(tokens);
  
}


async function displayByCategory() {

  document.getElementById('all').innerHTML = '';
  
  const projectsWithUsersData = ['uni', 'ens', 'looks', 'matic', 'zrx']
  let tokens = await getDB();
  console.log(tokens);
  
  tokens = sortTokens(tokens, 'percent_change_last_1_month');

  tokens.sort(function(a, b) {
      return a.metrics.return_since_launch - b.metrics.return_since_launch;
    });
  
  //makeAllTables(tokens);
  makeCatTables(tokens);
  
}

async function changeCriterion(crit) {
  let tokens = await getDB();
  
  tokens.sort(function(a, b) {
      return a.metrics.return_since_launch - b.metrics.return_since_launch;
    });
  
  let criterionRaw = crit.innerHTML;
  console.log(criterionRaw);

  let criterion = criterionRaw.toLowerCase()
  console.log(criterion);

  tokens.sort(function(a, b) {
    if (b[criterion] < a[criterion]) {
      return -1;
    }
    else if (b[criterion] > a[criterion]) {
      return 1;
    }
    return 0;
  });
  
  //let sortedTokens = sortTokens(tokens, criterion);
  console.log(tokens)
  makeAllProjectsTable(tokens);

  crit.style.textDecoration = "underline !important";
}


function sortTokens(tokens, criterion) {
  tokens.sort(function(a, b) {
    if (b[criterion] < a[criterion]) {
      return -1;
    }
    else if (b[criterion] > a[criterion]) {
      return 1;
    }
    return 0;
  });
  
  return tokens;
}


function makeCatTables(tokens) {
  const categories = ['priority', 'sector', 'sub-sector'];
  
  tokens.sort(function(a, b) {
      return a.metrics.return_since_launch - b.metrics.return_since_launch;
    });
  
  for (let cat of categories) {
    let container = document.createElement('div');
    
    container.setAttribute('id', cat);
    
    let title = document.createElement('h3'); 
   title.innerHTML = cat.charAt(0).toUpperCase() + cat.slice(1);
    container.appendChild(title);
    document.getElementById('tables').appendChild(container)

    let obj = makeObj(cat, tokens);
    let sortable = makeSortable(obj);

    sortable.sort(function(a, b) {
      return a[2] - b[2];
    });

    
    
    console.log(obj);
    makeTable(sortable, cat);
    
  }

  
}

function makeSortable(obj) {
  let sortable = [];
  for (let key in obj) {
      sortable.push([key, obj[key].count, obj[key].return]);
  }
  return sortable;
}




function makeObj(cat, tokens) {
  // Declare empty obj
  const obj = {}
  // Loop over tokens
  for (let token of tokens) {
    let prop = token[cat];
  // For each, check if token[cat] in obj
    if (!obj.hasOwnProperty(prop)) {
       // if not, add + value = array [return since launch]
      obj[prop] = [token.metrics.return_since_launch];
    }
  // else push return since launch to value array
    else { obj[prop].push(token.metrics.return_since_launch);
    }
  }
  // console.log(obj);
  
  // Loop over keys in obj 
  for (let key in obj) {
  // for each assign as value the avg of elements in array
    let len = obj[key].length
    let avg = Math.round(getArrayAvg(obj[key]));
    obj[key] = {count: len, return: avg};
  }
  // return obj

  return obj;
}


function getArrayAvg(arr) {
  let len = arr.length;
  let sum = 0;
  for (let el of arr) {
    sum += el;
  }
  return sum/len;
}


async function makeTable(arr, cat) {
  var myTable = document.getElementById(cat);

  var table = document.createElement('TABLE');
  
  table.setAttribute('class', "table");  
  var header = table.createTHead();
  
  header.setAttribute('class', 'th');
  var row = header.insertRow(0);
  var cell = row.insertCell(0);
  var cell1 = row.insertCell(1);
  var cell2 = row.insertCell(2);

  cell.innerHTML = `<b> ${cat.charAt(0).toUpperCase() + cat.slice(1)} </b>`;
  cell1.innerHTML = "<b>Count</b>"
  cell2.innerHTML = "<b>Return</b>";

  var tableBody = document.createElement('Tbody');
  
  table.appendChild(tableBody);


  for (let el of arr) {
    //console.log(works);
    var tr = document.createElement('tr');
    tableBody.appendChild(tr);
    var r = tableBody.insertRow(0);
    var c = r.insertCell(0);
    var c1 = r.insertCell(1);
    var c2 = r.insertCell(2);

    if (el[0] === 'H') {
      c.innerHTML = `<b style='color:green'>${el[0]}</b>`;
    }
    else if (el[0] === 'M') {
      c.innerHTML = `<b style='color:DarkOrange'>${el[0]}</b>`;
    }
    else if (el[0] === 'L') {
      c.innerHTML = `<b style='color:FireBrick'>${el[0]}</b>`;
    }
    else {
      c.innerHTML = el[0];
    }
    
    c1.innerHTML = el[1];
    c2.innerHTML = el[2] >= 0 ? `<span style='color:green'>+ ${el[2]} %</span>` : `<span style='color:FireBrick'>${el[2]} %</span>`;
    
  }
  //table.className = 'table_styling';

  
  myTable.appendChild(table);
  myTable.style.marginRight = '48px';
}


function makeAllProjectsTable(tokens) {

  document.getElementById('all').innerHTML = '';
  
  var myTable = document.getElementById('all');
  let title = document.createElement('h3'); 
  title.innerHTML = 'All tokens';
  myTable.appendChild(title);

  var table = document.createElement('TABLE');
  table.setAttribute('class', "table")
  var header = table.createTHead();
  header.setAttribute('class', 'th');
  var row = header.insertRow(0);
  var cell = row.insertCell(0);
  var cell1 = row.insertCell(1);
  var cell2 = row.insertCell(2);
  var cell3 = row.insertCell(3);
  var cell4 = row.insertCell(4);

  cell.innerHTML = `<b>Name</b>`;
  cell1.innerHTML = "<b onclick='changeCriterion(this)' class='crit'>Priority</b>"
  cell2.innerHTML = "<b onclick='changeCriterion(this)' class='crit'>Sector</b>";
  cell3.innerHTML = "<b onclick='changeCriterion(this)' class='crit'>Sub-sector</b>"
  cell4.innerHTML = "<b>Return</b>";

  var tableBody = document.createElement('Tbody');
  
  table.appendChild(tableBody);


  for (let token of tokens) {
    //console.log(works);
    var tr = document.createElement('tr');
    tableBody.appendChild(tr);
    var r = tableBody.insertRow(0);
    var c = r.insertCell(0);
    var c1 = r.insertCell(1);
    var c2 = r.insertCell(2);
    var c3 = r.insertCell(3);
    var c4 = r.insertCell(4);

    c.innerHTML = `<a href=/projects/${token.symbol} class='link'> ${token.name} </a>`;

    if (token.priority === 'H') {
      c1.innerHTML = `<b style='color:green'>${token.priority}</b>`;
    }
    else if (token.priority === 'M') {
      c1.innerHTML = `<b style='color:DarkOrange'>${token.priority}</b>`;
    }
    else if (token.priority === 'L') {
      c1.innerHTML = `<b style='color:FireBrick'>${token.priority}</b>`;
    }

    c2.innerHTML = token.sector;

    c3.innerHTML = token['sub-sector'];

    let roi = token.metrics.return_since_launch;
      
    c4.innerHTML = roi >= 0 ? `<span style='color:green'>+ ${roi} %</span>` : `<span style='color:FireBrick'>${roi} %</span>`;
    
  }
  //table.className = 'table_styling';

  
  myTable.appendChild(table);
  myTable.style.marginRight = '48px';
}