const mySecret = process.env['messari-api-key'];



// Token List 
const tokens = [
  {
    name: "Bitcoin",
    symbol: "btc",
    slug: "bitcoin",
    cg_slug: "bitcoin",
    sector: "layer-1"
  },
  {
    name: 'Ethereum',
    symbol: "eth",
    slug: "ethereum",
    cg_slug: "ethereum",
    sector: "layer-1"
  },
  {
    name: 'Solana',
    symbol: "sol",
    slug: "solana",
    cg_slug: "solana",
    sector: "layer-1"
  },
  {
    name: 'LidoDAO',
    symbol: "ldo",
    slug: "lido-dao",
    cg_slug: "lido-dao",
    sector: "DeFi"
  },
  {
    name: 'Polygon', 
    symbol: "matic",
    slug: "matic-network",
    cg_slug: "matic-network",
    sector: "Layer-2"
  },
  {
    name: 'Uniswap',
    symbol: "uni",
    slug: "uniswap",
    cg_slug: "uniswap",
    sector: "DeFi"
  },
  {
    name: "Sushiswap",
    symbol: "sushi",
    slug: "sushi",
    cg_slug: "sushi",
    sector: "DeFi"
  },
  {
    name:"Curve",
    symbol: "crv",
    slug: "curve",
    cg_slug: "curve-dao-token",
    sector: "De-Fi"
  },
  {
    name: "Synthetix",
    symbol: "synthetix",
    slug: "synthetix",
    cg_slug: "havven",
    sector: "DeFi"
  },
  {
    name: "ChainLink",
    symbol: "link",
    slug: "chainlink",
    cg_slug: "chainlink",
    sector: "Data"
  },
  {
    name: "Cosmos",
    symbol: "atom",
    slug: "cosmos",
    cg_slug: "cosmos",
    sector: "layer-1"
  },
  {
    name: "0x",
    symbol: "zrx",
    slug: "0x",
    cg_slug: "0x",
    sector: "Data"
  },
  {
    name: "API3",
    symbol: "api3",
    slug: "api3",
    cg_slug: "api3",
    sector: "Data"
  },
  {
    name: "Cube Network",
    symbol: "cube",
    slug: "cube-network",
    cg_slug: "cube-network",
    sector: "layer-1"
  },
  {
    name: "NFT Exchange",
    symbol: "nftx",
    slug: "nftx",
    cg_slug: "nftx",
    sector: "NFTs"
  },
  {
    name: "BNB",
    symbol: "bnb",
    slug: "binance-coin",
    cg_slug: "binancecoin",
    sector: "layer-1"
  }, 
  {
    name: "Helium",
    symbol: "hnt",
    slug: "helium",
    cg_slug: "helium",
    sector: "Real World"
  },
  {
    name: "Maker",
    symbol: "mkr",
    slug: "maker",
    cg_slug: "maker",
    sector: "DeFi"
  },
  {
    name: "The Graph",
    symbol: "grt",
    slug: "the-graph",
    cg_slug: "the-graph",
    sector: "Data"
  },
  {
    name: "Arweave",
    symbol: "ar",
    slug: "arweave",
    cg_slug: "arweave",
    sector: "Data"
  },
  {
    name: "Compound",
    symbol: "comp",
    slug: "compound",
    cg_slug: "compound-governance-token",
    sector: "DeFi"
  },
  // {
  //   name: "Osmosis",
  //   symbol: "osmo",
  //   slug: "osmosis",
  //   cg_slug: "osmosis",
  //   sector: "DeFi"
  // },
  {
    name: "Ethereum Name Service",
    symbol: "ens",
    slug: "ethereum-name-service",
    cg_slug: "ethereum-name-service",
    sector: "Other"
  },
  {
    name: "Handshake Name Service",
    symbol: "hns",
    slug: "handshake",
    cg_slug: "handshake",
    sector: "Other"
  },
  {
    name: "LooksRare",
    symbol: "looks",
    slug: "looksrare",
    cg_slug: "looksrare",
    sector: "NFTs"
  },
  {
    name: "Yearn Finance",
    symbol: "yfi",
    slug: "yearn-finance",
    cg_slug: "yearn-finance",
    sector: "DeFi"
  },
  {
    name: "Mina",
    symbol: "mina",
    slug: "mina",
    cg_slug: "mina-protocol",
    sector: "layer-1"
  },
  {
    name: "Liquity",
    symbol: "lqty",
    slug: "liquity",
    cg_slug: "liquity",
    sector: "DeFi"
  },
  {
    name: "Perpetual Protocol V2",
    symbol: "perp",
    slug: "perpetual-protocol",
    cg_slug: "perpetual-protocol",
    sector: "layer-1"
  },
  {
    name: "GMX",
    symbol: "gmx",
    slug: "gmx",
    cg_slug: "gmx",
    sector: "DeFi"
  },
  {
    name: "Tracer DAO",
    symbol: "tcr",
    slug: "tracer-dao",
    cg_slug: "tracer-dao",
    sector: "Other"
  },
  // {
  //   name: "Orca",
  //   symbol: "orca",
  //   slug: "orca",
  //   cg_slug: "orca",
  //   sector: "DeFi"
  // },
  {
    name: "Umami",
    symbol: "umami",
    slug: "umami-finance",
    cg_slug: "umami-finance",
    sector: "Other"
  },
  {
    name: "Mango",
    symbol: "mngo",
    slug: "mango-markets",
    cg_slug: "mango-markets",
    sector: "Other"
  },
  {
    name: "Synapse",
    symbol: "syn",
    slug: "synapse",
    cg_slug: "synapse-2",
    sector: "Other"
  },
  {
    name: "THORChain",
    symbol: "thorchain",
    slug: "thorchain",
    cg_slug: "thorchain",
    sector: "DeFi"
  }
]



import fetch from 'node-fetch';

import express from 'express';

import Nedb from 'nedb';

import https from 'https';

//import { exit } from 'process';

import fs from 'fs';

import csvWriter from 'csv-write-stream';

import csvParser from 'csv-parser';

import schedule from 'node-schedule'

// run everyday at midnight

//import projectRouter from './routes/projects.js'

import path from 'path'

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// const fetch = require('node-fetch');

// var Datastore = require('nedb');

let dates = [];
let values = [];

const app = express();
//const router = express.Router();


app.listen(3000, () => {
  console.log('server started');
});

//app.use(express.static(path.join(__dirname, 'public')));
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs')
app.use(express.static('public'));
app.use(express.static('historical_data'));
app.use(express.json({limit : '1mb'}));
//app.use('/projects', projectRouter)
//app.use(express.static(path.join(__dirname, 'views')))



var db = new Nedb({ filename: 'database.db' }); 

db.loadDatabase();
//db.insert(tokens);

app.get('/', (req, res) => {
  res.sendFile('index.html');
})

app.get('/projects/:symbol', (req, res) => {
  res.sendFile(__dirname + '/public/charts.html');
})

app.get('/api', (request, response) => {
  db.find({}, (err, data) => {
    if (err) {
      response.end();
      return;
    }
    response.json(data);
  })
});


const historic = ["users", "tvl", "price_usd", "volume_last_24_hours", "txn_volume_last_24_hours_usd", "active_addresses", "addresses_balance_greater_10_usd_count"];
// Update CSVs 

const rule = new schedule.RecurrenceRule();
rule.hour = 14;
rule.second = 0;
rule.minute = 0;

rule.tz = 'America/New_York';

schedule.scheduleJob(rule, () => {
  runDailyUpdate();
}) 

function runDailyUpdate() {
  var all = null
  db.find({}, function (err, docs) {
    all = docs;
    updateCSVs(all, append);
  });
}


function updateCSVs(data, cb) {
  // for each token (el in array)
  for (let token of data) {
  // get token symbol
    let sym = token.symbol;
    //if (sym === 'api3') { //
  // for each metric in metrics
      if (token.metrics) {
        for (let metric in token.metrics) {
          // append(sym, met)
          if (historic.includes(metric)) {
            try {
              cb(sym, token, metric);
            }
            catch {
              console.log('no csv data for :' + sym);
            }
          }
        }
      }
    //} 
  }
  console.log('updated');
}

// db.remove({ name: "Cube Network" }, {}, function (err, numRemoved) {
//   if (err) {console.log(err)}
//   console.log('removed');
// });




// Append daily data to csv
function append(sym, token, met) {
  //console.log(met);
  let parentPath = "public/historical_data/" + sym;
  let finalPathFile = "public/historical_data/" + sym + "/" + met + ".csv";
  let today = new Date().toISOString().slice(0, 10);
  //let today = '2022-08-23';
  if (fs.existsSync(parentPath)) {
    var writer = csvWriter()
    if (!fs.existsSync(finalPathFile))
      writer = csvWriter({ headers: ["header1", "header2"]});
    else
      writer = csvWriter({sendHeaders: false});
    
    writer.pipe(fs.createWriteStream(finalPathFile, {flags: 'a'}));
    writer.write({
      header1: today,
      header2: token.metrics[met].replaceAll(',', '')
    });
    writer.end();
  }
}


//findData();



// //db.persistence.compactDatafile






// Update database every 1h
setInterval(
  async () => {

        let today = new Date().toISOString().slice(0, 10);
        // For each token in the obj
        let counter = 0;
        for (let token of tokens) {
            counter++;
            // set interval
            let sym = token.symbol;

            //async function updateToken() {
            let data = await getTokenData(sym);

            if (typeof data === 'undefined') {
                console.log('api ran out');
            }
            else {
                console.log('data obtained: ' + token.name);
            }
            // get token data
            // get update on each metric
            let obj = {};

            try {
                obj["price_usd"] = data.market_data.price_usd.toLocaleString().replaceAll(',', '');
                obj["volume_last_24_hours"] = data.market_data["volume_last_24_hours"].toLocaleString().replaceAll(',', '');
            }
            catch {
                console.log('');
            }

            try {
                obj["percent_change_usd_last_24_hours"] = data.market_data["percent_change_usd_last_24_hours"].toLocaleString().replaceAll(',', '');   
            }
            catch {
                console.log('');
            }

            try {
                obj["percent_change_last_1_week"] = data.roi_data["percent_change_last_1_week"].toLocaleString().replaceAll(',', '');   
              obj["percent_change_last_1_month"] = data.roi_data["percent_change_last_1_month"].toLocaleString().replaceAll(',', '');   
              obj["percent_change_last_3_month"] = data.roi_data["percent_change_last_3_month"].toLocaleString().replaceAll(',', '');   
              obj["percent_change_last_1_year"] = data.roi_data["percent_change_last_1_year"].toLocaleString().replaceAll(',', '');   
            }
            catch {
                console.log('');
            }
          
            try {
                obj["txn_volume_last_24_hours_usd"] = data["on_chain_data"]["txn_volume_last_24_hours_usd"].toLocaleString().replaceAll(',', '');
                obj["active_addresses"] = data["on_chain_data"]["active_addresses"].toLocaleString().replaceAll(',', '');
                obj["addresses_balance_greater_10_usd_count"] = data["on_chain_data"]["addresses_balance_greater_10_usd_count"].toLocaleString().replaceAll(',', '');
            }
            catch {
                console.log('');
            }

    //       if (counter > 20) {
  
    //       try {
    //         obj["launch_price"] = await fetch("https://api.coingecko.com/api/v3/coins/" +  token.cg_slug + "/history?date=01-07-2022/")
    // .then((response) => response.json())
    // .then(data => {
    //     return data.market_data.current_price.usd;
    // })
    //       }
    //       catch {
    //         console.log('no launch price for ' + token.name)
    //       }
    // //       }
    //       if (counter < 20) {

          
            updateToken(sym, obj, 'metrics');
          //}
            
        }
    }, 3600000);


// console.log(launchp);

//loadHis();
function loadHis() {
  var all = null
  db.find({}, function (err, docs) {
    all = docs;
    loadHistoricalData(all, updateToken);
  });
}


async function loadHistoricalData(db, cb) {
  for (let tokenObj of db) {
    const info = {};
    const sym = tokenObj.symbol;
    // Get metrics if available
    let metrics;
    try {
      metrics = tokenObj.metrics;
    }
    catch {
      console.log('no metrics for: ' + sym);
    }


      // for each metric in metrics
    for (let metric of historic) {
      info[metric] = [];
      let path = "public/historical_data/" + sym + "/" + metric + ".csv";
      //console.log(path);
      try {
        if (fs.existsSync(path)) {
        
          fs.createReadStream(path)
          .pipe(csvParser({}))
          .on('data', (data) => {
            
            info[metric].push(data);
          })
          .on('end', () => {
            //console.log(info[metric])
          });
        }
        else{
          console.log('')
        }
      
      }
      catch {
        console.log('no data for ' + sym + ' ' + metric);
      }
  }
    //console.log(info);
    //cb(sym, info, 'historical_data');
  }
}


// async function loadHistoricalData(db, cb) {
//   for (let tokenObj of db) {
//     const info = {};
//     const sym = tokenObj.symbol;
//     // Get metrics if available
//     let metrics;
//     try {
//       metrics = tokenObj.metrics;
//     }
//     catch {
//       console.log('no metrics for: ' + sym);
//     }


//       // for each metric in metrics
//     for (let metric in metrics) {

      
//       let res;
//       try {
//         res = await fetch("./historical_data/" + sym + "/" + metric + ".csv");
      
//       //console.log(metric);
//       const text = await res.text();
//         console.log(text);
//     // historical_data_btc.csv
    
//       const first = text.split('\n').slice(0, 1);
//       const table = text.split('\n').slice(1);
//       //console.log(rows);
//       const firstRow = first.toString().split(',');
    
//       info[metric] = {};
      
//       // for each colomn
//       for (let i = 0; i < firstRow.length; i++) {
//         let title = firstRow[i].replaceAll('"', '');
//         info[metric][title] = [];
        
//         // for each row
//         for (let j = 0; j < table.length; j++) {
//           const row = table[j].split(',');
//           info[metric][title].push(row[i].replaceAll('"', ''));
//         }
//       }
    
//     }
//     catch {
//       console.log('');
//     }
//   }
//     console.log(info);
//     //cb(sym, info, 'historical_data');
//   }
// }




  
  
  // Update a token's document in db
  function updateToken(sym, obj, category) {
    for (let key in obj) {
      if (obj[key]) {
        // let access_dates = `historical_data.${key}.dates`;
        let access_values = `${category}.${key}`;
        db.update({symbol: sym}, { $set: { [access_values]: obj[key] } }, {}, function () {
         });
      }  
    }
  }

function updateReturn() {
  for (let token of tokens) {
    db.find({ symbol: token.symbol }, function (err, docs) {
      console.log(docs[0].metrics.launch_price);
      let roi = Math.round(((Number(docs[0].metrics.price_usd) / docs[0].metrics.launch_price) - 1) * 100);
      console.log(roi)
      db.update({symbol: token.symbol}, { $set: { 'metrics.return_since_launch' : roi} }, {}, function () {
           });
      console.log(docs[0].metrics.return_since_launch);
  });
  }
}
setInterval(() => updateReturn(), 3600000);



// console.log( await getTokenData("btc"));
// Get the token's data from the fetched obj
async function getTokenData(sym) {
  const data = await makeRequest(sym)
    .then(res => {
        // here is what you want
        return res.data;  
    });
  return data;
}

// Fetch a token's data from api
function makeRequest(sym){    
  return new Promise(resolve => {
        let obj='';
        let options={
          host: "data.messari.io",
          path: "/api/v1/assets/" + sym + "/metrics",
          headers: { "x-messari-api-key": mySecret },
        };
        //let https=require(protocol);
        const callback = function(response){
            var str='';

            response.on('data',function(chunk){
                str+=chunk;
            });

            response.on('end',function(){
                obj=JSON.parse(str);
                resolve(obj);
            });
        }
        let request = https.request(options,callback);
       // request.write('{"id":"ID","method":"'+ method +'","params":{},"jsonrpc":"2.0"}');
        request.end();
  });
}

//console.log(data);



// tokens_arr = [
//   'Bitcoin',
//   'Ethereum',
//   'Solana',
//   'LidoDAO',
//   'Polygon',
//   'Uniswap',
//   'Sushiswap',
//   'Curve',
//   'Synthetix',
//   'ChainLink',
//   'Cosmos',
//   '0x',
//   'API3',
//   'Cube Network',
//   'NFT Exchange',
//   'Binance Smart Chain',
//   'Helium',
//   'Maker',
//   'The Graph',
//   'Arweave',
//   'Compound',
//   'Osmosis',
//   'Ethereum Name Services',
//   'Handshake Name Services',
//   'LooksRare',
//   'Yearn Finance',
//   'Mina Protocol',
//   'Liquity',
//   'Perpetual Protocol V2',
//   'GMX',
//   'Tracer DAO',
//   'Orca',
//   'Umami',
//   'Mango',
//   'Synapse',
//   'THORChain'
// ]