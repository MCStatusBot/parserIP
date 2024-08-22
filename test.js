
const ParserIP = require('./index');


const myIP = ParserIP('192.168.0.455.444');
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
