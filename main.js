/**
 * Main script for Canadian Crypto Alerta
 * Author: Colin McParland
 * December 2017
 */

//  Load env variables
require('dotenv').config();

//  Load npm modules
var shell = require('shelljs');
var forever = require('forever');
var request = require('request');
var ceiling = parseFloat(process.argv.slice(process.argv.length - 1));
var rp = require('request-promise-native');
var twilio = require('twilio')(
  process.env.TWILIO_ID,
  process.env.TWILIO_TOKEN
);


/**
 * Declare a URL to ping, and define a getBid function to get the latest bid from QuadrigaCX.
 * @type {Object}
 */
var options = {
  uri: 'https://api.cbix.ca/v1/index'
}

function getBid (price) {
  rp(options)
    .then(function(body) {
      body = JSON.parse(body);
      bid = body.exchanges[0].bid;

      if(bid == undefined) {
        console.log(body);
      }
      else if(parseFloat(bid) > ceiling) {
        sendSMS('sell', bid);
      }
    });
}


/**
 * Declare a function to send a text message when the desired price is reached.
 */
function sendSMS(action, price) {
  twilio.messages.create({
    from: process.env.TWILIO_PHONE,
    to: process.env.MY_CELL,
    body: "QuadrigaCX average bid has reached $" + price + ", time to " + action + " some BTC!"
  }).then(function()  {
    shell.exec('forever stop ' + process.pid);
  });
}

/**
 * Main function
 */
if(isNaN(ceiling)) {
  console.log('Please enter a number.');
  process.exit(1);
} else {
  getBid(ceiling);
  setInterval(function()  {
    getBid(ceiling);
  }, 10000);
}





