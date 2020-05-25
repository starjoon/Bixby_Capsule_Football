var lib = require('./lib.js')
var config = require('config');
var console = require('console');

module.exports.function = function showPlayer (playerTeam,stats) {
  playerStats = lib.GetPlayer(playerTeam);
  return playerStats
}
