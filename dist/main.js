var rp = require('request-promise-native');
var inquirer = require('inquirer');
var sqlite3 = require('sqlite3');
var db;


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


/**
 * Set up command line prompts to give to the user in order to get our input.
 */
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
 *   Begin DB functions
 */

//  Promise to connect to DB
var connectToDB = new Promise(function(resolve, reject) {
  db = new sqlite3.Database('./main.db', (err) => {
    if(err) {
      reject('Error: ' + err);
    }
    else {
      resolve('Conected to DB');
    }
  });
});

//  Create phone number table
function createPhoneNumberTable() {
    db.run('CREATE TABLE IF NOT EXISTS phnumbers(phone_number INT)', (err) => {
    if(err) {
      return 'Error: ' + err;
    }
    else {
      return 'Phone number table created';
    }
  });
}

//  Get the phone number
function getPhoneNumber() {
  return new Promise(function(resolve, reject) {
    db.all('SELECT * FROM phnumbers', (err, rows) => {
      if(err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });  
  });
}

function getTables() {
  return new Promise(function(resolve, reject) {
    db.all("SELECT * FROM sqlite_master WHERE type='table'", (err, rows) => {
      if(err) {
        reject(err);
      } else {
        resolve(rows);
      }
    }); 
  });
}

// Function to add a phone number
function addPhoneNumber(number) {
  return new Promise(function(resolve, reject) {
     db.run('INSERT INTO phnumbers(phone_number) VALUES(?)', [number], function(err) {
      if(err) {
        reject(err);
      }
      else {
        resolve(0);
      }
    }); 
  });
}  



/**
* Main function
*/

function main() {
  connectToDB
    .then(function(result) {
      Promise
        .all([getTables(), getPhoneNumber()])
        .then(function(data) {
          if(data[0].length == 0 || data[1].length == 0) {
            inquirer
              .prompt(phone_options)
              .then(function(answers) {
                addPhoneNumber()
                  .then(function(data) {
                    if(data == 0) {
                      console.log('Phone number successfully set.  Start  setting some alerts!');
                      main();
                    } else {
                      console.log('Error adding your phone number: ' + da);
                    }
                  }, function(error) {
  
                  })
              });
          } else {
            inquirer
              .prompt(prompt_options)
              .then(function(answers) {
                if(answers.alert_type == 'Ask' || answers.alert_type == 'Bid') {
                  getPhoneNumber()
                    .then(function(number) {
                      console.log(number);
                      // number = number[number.length - 1];
                      // sendRequest(answers.alert_type, answers.alert_amount, number);
                    })
                } else {
                  main();
                }
              });
          }
        })
  }, function(err) {
    console.log(err);
  });
}
main();
