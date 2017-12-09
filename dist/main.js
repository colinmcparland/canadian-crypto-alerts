var rp = require('request-promise-native');
var inquirer = require('inquirer');

function sendRequest(type, amount) {
  var request_options = {
    method: 'POST',
    headers: {
      'Connection': 'keep-alive'
    },
    uri: 'http://www.tinybird.ca:1234',
    body: {
      type: type,
      amount: amount
    },
    json: true
  };
  
  rp(request_options).
    then(function(body) {
      if(body.status == 200) {
        console.log(body.message);
      } else {
        console.log(body.message + " " + body.err);
      }
    });
}


/**
 * Set up command line prompts to give to the user in order to get our input.
 */
var prompt_options = [{
  type: 'list',
  name: 'alert_type',
  message:  'What type of alert do you want to set?',
  choices: [
    'Ask',
    'Bid'
  ]
},
{
  type: 'input',
  name: 'alert_amount',
  message: 'At which price do you want to be notified?',
  validate: function(val) {
    val = parseFloat(val);
    if(isNaN(val)) {
      return 'Please enter a valid number.';
    } else {
      return true;
    }
  }
}];

/**
* Main function
*/
inquirer
  .prompt(prompt_options)
  .then(function(answers) {
    sendRequest(answers.alert_type, answers.alert_amount);
  });
  