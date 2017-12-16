# [Canadian Crypto Alerts](http://cryptoalerts.tinybird.ca)

This tool lets you input your cell phone number then set certain bid/ask prices for which you will be sent a text message notification. Eventually, this tool will be able to set alerts across multiple Canadian Crypto Exchanges, as well as handle alerts with different coins.

###  To download (Linux only for now):

```
wget https://github.com/colinmcparland/canadian-crypto-alerts/blob/master/dist/cryptoalert-linux
```
```
mv cryptoalert-linux /usr/local/bin/cryptoalert
```
```
cryptoalert
```

### To use
Once downloaded, execute the program simply by typing <kbd>cryptoalert</kbd> into your terminal.  Prompts will guide you through the rest of the program.

### Stuff used to make this:

 * [nodejs](https://nodejs.com) and [npm](https://npm.com)
 * [forever](https://www.npmjs.com/package/forever) 
 * [lowdb](https://www.npmjs.com/package/lowdb)
 * [request](https://www.npmjs.com/package/request)
 * [inquirer](https://www.npmjs.com/package/inquirer)
 * [shelljs](https://www.npmjs.com/package/shelljs)
 * [twilio](https://www.npmjs.com/package/twilio)
 * [pkg](https://www.npmjs.com/package/pkg)
