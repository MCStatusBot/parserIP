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

function isNumeric(str) {
  return !isNaN(str) && !isNaN(parseFloat(str)) && str.trim() !== '';
}

function validateIPv6(ipv6) {
  const segments = ipv6.split(':');
  if (segments.length > 8) return false;
  const emptySegments = segments.filter(seg => seg === '').length;
  for (let segment of segments) {
    if (segment.length > 0 && !/^[a-f0-9]{1,4}$/i.test(segment)) {
      return false;
    }
  }
  return emptySegments <= 1 && (segments.length === 8 || ipv6.includes('::'));
}

module.exports = function ParserIP(address) {
  const addressLowerCase = address.toLowerCase();
  let match = addressLowerCase.match(ipv6Pattern) || addressLowerCase.match(ipv6NoBracketsPattern) || addressLowerCase.match(ipv4Pattern) || addressLowerCase.match(domainPattern);

  const result = {
    domain: null,
    ipv4: null,
    ipv6: null,
    port: null,
    invalidDomain: false,
    invalidPort: false
  };

  if (!match || !match.groups) return result;

  result.domain = match.groups.domain || null;
  result.ipv4 = match.groups.ipv4 || null;
  result.ipv6 = match.groups.ipv6 || null;
  result.port = match.groups.port || null;


  //domain
  if (result.domain) {
    const domainParts = result.domain.split('.');
    const tld = domainParts[domainParts.length - 1].toUpperCase();
    //tdl cant be only numbers or maybe it can
    if (isNumeric(tld)) {
      result.invalidDomain = true;
    }
    if (TDLList.length >= 1 && !TDLList.includes(tld)) {
      result.invalidDomain = true;
    }
  }

  //IPv4
  if (result.ipv4) {
    const octets = parseInt(result.ipv4.split('.'));
    console.log(octets)
    const validIPv4 = octets.length === 4 && octets.every(octet => octet >= 0 && octet <= 255);
    if (!validIPv4) {
      result.ipv4 = null;
    }
  }
  //IPv6
  if (result.ipv6) {
    const isValidIPv6 = validateIPv6(result.ipv6);
    if (!isValidIPv6) {
      result.ipv6 = null;  // Invalidate the IPv6 if the format is wrong
    }
  }

  //port
  if (result.port) {
    const port = parseInt(match.groups.port, 10);
    result.port = port;
    if (port <= 0 || port > 65535) {
      result.invalidPort = true;
    }
  }


  return result;
}