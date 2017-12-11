var sqlite3 = require('sqlite3');
var db;




var connectToDB = new Promise(function(resolve, reject) {
  db = new sqlite3.Database(':memory:', (err) => {
    if(err) {
      console.log('connection err!');
      reject('Error: ' + err);
    }
    else {
      console.log('copnnected!');
      resolve('Conected to in-memory DB');
    }
  });
});

function createPhoneNumberTable(number) {
  connectToDB();
  //  Create phone number table
  db.run('CREATE TABLE if not exists phnumbers(phone_number INT)', (err) => {
    if(err) {
      console.log(err);
    }
    else {
      addPhoneNumber(number);
    }
  });
  
}


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




