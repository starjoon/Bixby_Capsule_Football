var lib = require('./lib.js')
var config = require('config');
var console = require('console');

let result = [];
let teams = [];
let players = [];

module.exports.function = function getMatch (matchID) {
  match = lib.GetMatch(matchID);
  result[0] = match[0];
  teams.push(match[0].home);
  teams.push(match[0].away);
  getTeams = lib.GetTeam(teams);
  var ctr = 0;
  while (result[0].home_logo == null || result[0].away_logo == null) {
    if (result[0].home == getTeams[ctr].team) {
      result[0].home_logo = getTeams[ctr].teamPic;
    } else if (result[0].away == getTeams[ctr].team) {
      result[0].away_logo = getTeams[ctr].teamPic;
    }
    ctr++;
  }
  console.log(result);

  return result
}
