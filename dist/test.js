var sqlite3 = require('sqlite3');
var db;

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

//  Promise to create phone number table
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

//  Promise to get the phone number
function getPhoneNumber() {
  db.all('SELECT * FROM phnumbers', (err, rows) => {
    if(err) {
      console.log(err);
    } else if(rows.length == 0)  {
      console.log('No phone number set.');
    } else if(rows.length > 0){
      console.log(rows);
    }
  });
}

function getTables() {
  db.all("SELECT * FROM sqlite_master WHERE type='table'", (err, rows) => {
    if(err) {
      console.log(err);
    } else {
      console.log(rows);
    }
  }); 

}


// Function to add a phone number
function addPhoneNumber(number) {
  db.run('INSERT INTO phnumbers(phone_number) VALUES(?)', [number], function(err) {
    if(err) {
      console.log(err);
    }
    else {
      console.log('Phone number added');
      getPhoneNumber();
    }
  });
}


//  Connect to the DB
connectToDB
  .then(function(result) {
    console.log(result);
    // createPhoneNumberTable();
    getTables();
    db.close();
    //Create the phone numbers table
    // createPhoneNumberTable
    //   .then(function(result) {
    //     console.log(result);
    //     getTables();
    //     db.close();
        
    //   }, function(err) {
    //     console.log(err);
    //   })
    }, function(err) {
      console.log(err);
    });
