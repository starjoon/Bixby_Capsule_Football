var lib = require('./lib.js')
var config = require('config');
var console = require('console');

let result = [];
let teams = [];
let players = [];

module.exports.function = function getLeg (league,playerName,game) {
  match = lib.GetLeg(league,playerName,game);
  result[0] = match[0];
  if (result[0].matchProgress != null) {
    matchTime = result[0].matchProgress.time;
    result[0].matchProgress.timeProp = Math.round(matchTime/90*100)
  }
  teams.push(match[0].home);
  teams.push(match[0].away);
  players.push(match[0].playerName);

  players = [].concat.apply([],players)
  getTeams = lib.GetTeam(teams);
  getPlayers = lib.GetPlayer(players);

  var ctr = 0;
  while (result[0].home_logo == null || result[0].away_logo == null) {
    if (result[0].home == getTeams[ctr].team) {
      result[0].home_logo = getTeams[ctr].teamPic;
      result[0].home_rank = getTeams[ctr].rank;
      result[0].home_win = getTeams[ctr].win;
      result[0].home_draw = getTeams[ctr].draw;
      result[0].home_loss = getTeams[ctr].loss;
      result[0].home_pts = getTeams[ctr].points;
      result[0].homeLastFive = getTeams[ctr].lastFive;
    } else if (result[0].away == getTeams[ctr].team) {
      result[0].away_logo = getTeams[ctr].teamPic;
      result[0].away_rank = getTeams[ctr].rank;
      result[0].away_win = getTeams[ctr].win;
      result[0].away_draw = getTeams[ctr].draw;
      result[0].away_loss = getTeams[ctr].loss;
      result[0].away_pts = getTeams[ctr].points;
      result[0].awayLastFive = getTeams[ctr].lastFive;
    }
    ctr++;
  }
  result[0].playerInfo = []
  if (Array.isArray(result[0].playerName)) {
    for (j in getPlayers) {
      if (lib.IsIn(getPlayers[j].name,result[0].playerName)) {
        result[0].playerInfo.push({
          'playerName': getPlayers[j].name,
          'playerPic':getPlayers[j].profPic,
          'matchesPlayed':getPlayers[j].matchesPlayed,
          'goals':getPlayers[j].goal,
          'assists':getPlayers[j].assist
          });
      }
    }
  } else {
    for (j in getPlayers) {
      if (getPlayers[j].name == result[0].playerName) {
        result[0].playerInfo.push({
          'playerName': getPlayers[j].name,
          'playerPic':getPlayers[j].profPic,
          'matchesPlayed':getPlayers[j].matchesPlayed,
          'goals':getPlayers[j].goal,
          'assists':getPlayers[j].assist
          });
        break
      }
    }
  }

  console.log(result);

  return result
}
