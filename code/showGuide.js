var lib = require('./lib.js')
var config = require('config');
var console = require('console');

let result = [];

module.exports.function = function showGuide () {
  allPlayers = lib.GetPlayers();
  for (i in allPlayers) {
    result[i] = allPlayers[i];
  }
  return result
}
