var http = require('http');

http
  .createServer(function (request, response) {
    response.write('Ya got me.');
    response.end();
  })
  .listen(1234);