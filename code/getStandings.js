var lib = require('./lib.js')
var config = require('config');
var console = require('console');

let result = [];

module.exports.function = function getStandings (league,rank) {
  console.log(league)
  if (league == 'UEFA 챔피언스 리그') {
    groups = lib.GetUEFA();
    for (i in groups) {
      result[i] = groups[i]
    }
    console.log(result)
    return result
  }
  var options = {
    format: 'json',
    query: {
      league: league
    },
    cacheTime:5000
  }
  standings = lib.GetStandings(options);
  for (i in standings) {
    result[i] = standings[i]
  }
  return result
}
