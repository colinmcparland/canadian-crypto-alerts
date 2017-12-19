var rp = require('request-promise-native');
var inquirer = require('inquirer');
var low = require('lowdb');
var path = require('path');
var FileSync = require('lowdb/adapters/FileSync');
var adapter = new FileSync(path.join(path.dirname(process.execPath), '/db.json'));
var db = low(adapter);
const table = require('table').table;

function getAlerts(number) {
  var request_options = {
    method: 'GET',
    headers: {
      'Connection': 'keep-alive'
    },
    uri: 'http://www.tinybird.ca:1234/?number=' + number,
    json: true
  };

  rp(request_options).
    then(function(body) {
      if(body.length == 0) {
        console.log("No alerts set at this number.");
      } else {
        console.log(table(body));
      }
    });
}

getAlerts(2896810694);