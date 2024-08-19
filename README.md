# parserIP
input your ipv4, ipv6 or domain and see if it is valid

## install

`npm i https://github.com/MCStatusBot/parserIP.git`

## example

```js

const ParserIP = require('parserip');


const myIP = ParserIP('192.168.0.22');
console.log(myIP);
/*
{
  domain: null,
  ipv4: '192.168.0.22',
  ipv6: null,
  port: null,
  invalidDomain: false,
  invalidPort:true
}
*/

const myIPWPort = ParserIP('192.168.0.22:8080');
console.log(myIPWPort);
/*
{
  domain: null,
  ipv4: '192.168.0.22',
  ipv6: null,
  port: '8080',
  invalidDomain: false,
  invalidPort:true
}
*/


const myDomain = ParserIP('test.mcstatus.net');
console.log(myDomain);
/*
{
  domain: 'test.mcstatus.net',
  ipv4: null,
  ipv6: null,
  port: null,
  invalidDomain: false,
  invalidPort:true
}
*/

const myIPv6 = ParserIP('[2602:f964:1:d::d]:80');
console.log(myIPv6);
/*
{
  domain: null,
  ipv4: null,
  ipv6: '2602:f964:1:d::d',
  port: 80,
  invalidDomain: false,
  invalidPort:true
}
*/
```