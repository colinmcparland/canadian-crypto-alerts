var http = require('http');
var util = require('util');
var shell = require('shelljs');
var url = require('url');
var forever = require('forever');

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

          shell.exec('forever start main.js ' + json_postdata.number + ' ' + json_postdata.type + ' ' + json_postdata.amount, function(code, out, err) {
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
    /*
    Started here to process the request to get a list of alerts for a given phone number, look at using forever programmatically 
     */
    else if(request.method == 'GET') {
      var query = url.parse(request.url, true).query;
      var asks = [];
      var bids = [];
      var ret = [];

      //  Get a list of all alerts for this number
      if(query.number != null) {
        console.log('phone number');
        forever.list(false, function(err, data) {
          for(var i = 0; i < data.length; i++) {
            var proc = data[i];
            // console.log(JSON.stringify(proc));
            if(proc.file == 'main.js' && proc.args[0] == query.number) {
              if(proc.args[1] == 'Ask') {
                console.log('add ask');
                asks.push([proc.args[1], proc.args[2]]);
              } else if (proc.args[1] == 'Bid') {
                bids.push([proc.args[1], proc.args[2]]);
                console.log('add bid');
              }
            }
          }

          ret = asks.concat(bids);
          response.write(JSON.stringify(ret));
          response.end();
        });
      }
    }
  })
  .listen(1234);