var http = require('http');
var util = require('util');
var shell = require('shelljs');

http
  .createServer(function (request, response) {
    //  Get the data chunks and make them into a JSON object
    var json_postdata = '';
    
    if(request.method == 'POST') {

      request
        .on('data', function (data) {
          console.log(data);
          json_postdata += data;
        });
  
      //  When the datas all done sending, convert the string to an object
      request
        .on('end', function () {
          json_postdata = JSON.parse(json_postdata); 
          
          response.setHeader('Content-Type', 'application/json');
          response.setHeader('Connection', 'keep-alive');

          shell.exec('forever start main.js ' + json_postdata.type + ' ' + json_postdata.amount, function(code, out, err) {
            if(code !== 0) {
              response.write(JSON.stringify({status: 500, message: 'Server error!  Code' + code, err: err}));
              response.end();

            } else {
              response.write(JSON.stringify({status: 200, message: 'Alert created successfully.', output: out}));
              response.end();
            }
          });

          

        });
    }
    else {
      response.write('POST only, please!  (for now)');
      response.end();
    }
  })
  .listen(1234);