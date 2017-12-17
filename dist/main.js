var rp = require('request-promise-native');
var inquirer = require('inquirer');
var low = require('lowdb');
var path = require('path');
var FileSync = require('lowdb/adapters/FileSync');
var adapter = new FileSync(path.join(path.dirname(process.execPath), '/db.json'));
var db = low(adapter);


/**
 * Function used to send a request to the server that will start up an alert thread.
 */
function sendRequest(type, amount, number) {
  var request_options = {
    method: 'POST',
    headers: {
      'Connection': 'keep-alive'
    },
    uri: 'http://www.tinybird.ca:1234',
    body: {
      type: type,
      amount: amount,
      number: number,
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
var prompt_options = [
  {
    type: 'list',
    name: 'alert_type',
    message: 'What type of alert do you want to set?',
    choices: [
      'Ask',
      'Bid',
      new inquirer.Separator(),
      'Change phone number',
      //todo:  list active alerts
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
    },
    when: function(answers) {
      if(answers.alert_type == 'Change phone number') {
        return false;
      }
      return true;
    }
  },
  {
    type: 'input',
    name: 'new_phone',
    message:  'Please enter a new phone number.  Eg. 5551231234',
    validate: function(val){
      if(isNaN(val) || val.length != 10) {
        return 'Please enter a valid phone number with area code.  Eg.  5551231234'
      } else {
        return true;
      }
    },
    when: function(answers) {
      if(answers.alert_type != 'Change phone number') {
        return false;
      }
      return true;
    }
  }
];

var phone_options = [
  {
    type: 'input',
    name: 'phone_input',
    message:  'Please enter your phone number.  Eg. 5551231234',
    validate: function(val){
      if(isNaN(val) || val.length != 10) {
        return 'Please enter a valid phone number with area code.  Eg.  5551231234'
      } else {
        return true;
      }
    }
  }
];


/**
 * Add/update phone number in lowdb
 */
function addPhoneNumber(number) {
  db.set('phone_number', number).write();
}  



/**
 * Begin inquirer functions
 */

function getPhoneNumberInput() {
  inquirer
    .prompt(phone_options)
    .then(function(answers) {
      // console.log(answers);
      addPhoneNumber(answers.phone_input);
      console.log('Phone number successfully set.  Start  setting some alerts!');
      main();
    })
}

function setAlert() {
  inquirer
    .prompt(prompt_options)
    .then(function(answers) {
      if(answers.alert_type == 'Ask' || answers.alert_type == 'Bid') {
        number = db.get('phone_number').value();
        sendRequest(answers.alert_type, answers.alert_amount, number);
      } else {
        addPhoneNumber(answers.new_phone);
        main();
      }
    });
}


/**
* Main function
*/

function main() {
  if(db.get('phone_number').value() == '' || db.get('phone_number').value() == undefined) {
    getPhoneNumberInput();
  } else {
    setAlert();
  }
}

main();
