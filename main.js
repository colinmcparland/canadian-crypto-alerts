/**
 * Main script for Canadian Crypto Alerta
 * Author: Colin McParland
 * December 2017
 */

//  Load env variables
require('dotenv').config();

//  Load npm modules
var inquirer = require('inquirer');
var shell = require('shelljs');
var forever = require('forever');
var rp = require('request-promise-native');
var request = require('request');
var amount = parseFloat(process.argv.slice(process.argv.length - 1));
var type = process.argv.slice(process.argv.length - 2)[0];
var phnumber = process.argv.slice(process.argv.length - 3)[0];
var twilio = require('twilio')(
  process.env.TWILIO_ID,
  process.env.TWILIO_TOKEN
);

console.log(type);
console.log(amount);


/**
 * Main function
 */
if(type == 'Ask') {
  getAsk(amount);
  setInterval(function()  {
    getAsk(amount);
  }, 3000);
} else if(type == 'Bid') {
  getBid(amount);
  setInterval(function()  {
    getBid(amount);
  }, 3000);
} else {
  console.log('Error with type.');
  process.exit(1);
}



/**
 * Declare a URL to ping, and define a getBid and getAsk function to get the latest bid/ask from QuadrigaCX.
 */

function getBid (price) {
  rp('https://api.cbix.ca/v1/index')
    .then(function(body) {
      body = JSON.parse(body);
      bid = body.exchanges[0].bid;

      console.log(bid);

      if(bid == undefined) {
        console.log(body);
      }
      else if(parseFloat(bid) > price) {
        sendSMS(['bid', 'sell'], bid);
        // console.log('Bid price is high, sell!');
      } else {
        // console.log('Bid price is low, wait.')
      }
    });
}

function getAsk (price) {
  rp('https://api.cbix.ca/v1/index')
    .then(function(body) {
      body = JSON.parse(body);
      ask = body.exchanges[0].ask;

      console.log(ask);

      if(ask == undefined) {
        console.log(body);
      }
      else if(parseFloat(ask) < price) {
        sendSMS(['ask', 'buy'], ask);
        // console.log('Ask price is low, buy!');
      } else {
        // console.log('Ask price is high, wait!')
      }
    });
}


/**
 * Declare a function to send a text message when the desired price is reached.  When the message is sent, end this alerts process.
 */
function sendSMS(action, price) {
  twilio.messages.create({
    from: process.env.TWILIO_PHONE,
    to: phnumber,
    body: "QuadrigaCX average " + action[0] + " price has reached $" + price + ", time to " + action[1] + " some BTC!"
  }).then(function()  {
    shell.exec('forever stop ' + process.pid);
  });
}
