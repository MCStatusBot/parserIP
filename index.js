const axios = require('axios');

const domainPattern = /^(?<domain>[^:]+)(?::(?<port>\d+))?$/;
const ipv4Pattern = /^(?<ipv4>\d+\.\d+\.\d+\.\d+)(?::(?<port>\d+))?$/;
const ipv6Pattern = /^\[(?<ipv6>[0-9a-fA-F:]+)\](?::(?<port>\d+))?$/;
const ipv6NoBracketsPattern = /^(?<ipv6>[0-9a-fA-F:]+)(?::(?<port>\d+))?$/;


let TDLList = [];

async function fetchTLDlist() {
  try {
    const res = await axios.get('https://data.iana.org/TLD/tlds-alpha-by-domain.txt', {
      headers: { 'User-Agent': "mcstatus.net/3.0.0 the Minecraft status bot software" }
    });
    const arr = res.data.split('\n').filter((el) => !el.startsWith('#'));
    TDLList = arr;
    console.log("fetched tld list");
  } catch (error) {
    console.log(error.stack || error);
    console.log("could not fetch tlds domain validation will be off");
  }
  return;
}
fetchTLDlist();


module.exports = function ParserIP(address) {
  let match = address.match(ipv6Pattern) || address.match(ipv6NoBracketsPattern) || address.match(ipv4Pattern) || address.match(domainPattern);

  const result = {
    domain: null,
    ipv4: null,
    ipv6: null,
    port: null,
    invalidDomain: false,
    invalidPort: false
  };

  if (match && match.groups) {
    result.domain = match.groups.domain || null;
    result.ipv4 = match.groups.ipv4 || null;
    result.ipv6 = match.groups.ipv6 || null;
    result.port = match.groups.port || null;

    if (match.groups.port) {
      const port = parseInt(match.groups.port, 10);
      result.port = port;
      if (port <= 0 || port > 65535) {
        result.invalidPort = true;
      }
    }

    if (result.domain) {
      const domainParts = result.domain.split('.');
      const tld = domainParts[domainParts.length - 1].toUpperCase();
      if (TDLList.length >= 1 && !TDLList.includes(tld)) {
        result.invalidDomain = true;
      }
    }
  }
  return result;
}