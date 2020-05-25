var lib = require('./lib.js')
var config = require('config');
var console = require('console');
var fail = require('fail');

let result = [];

module.exports.function = function getSchedule(playerTeam, fixture, $vivContext) {
  matches = lib.GetSchedule(playerTeam);

  let teams = [];
  let players = [];
  var recentGames = true;

  for (i in matches) {
    result[i] = matches[i];
    if (result[i].matchProgress != null) {
      matchTime = result[i].matchProgress.time;
      result[i].matchProgress.timeProp = Math.round(matchTime / 90 * 100)
    }
    if (result[i].matchResult == null && recentGames) {
      result[i].recent = 1;
      result[i].status = '다음 경기';
      result[i - 1].recent = 1;
      result[i - 1].status = '최근 경기';
      recentGames = false;
    }
    teams.push(matches[i].home);
    teams.push(matches[i].away);
    players.push(matches[i].playerName);
    result[i].selectedPlayer = playerTeam;
  }
  if (recentGames == true) {
    result[result.length-1].recent = 1;
    result[result.length-1].status = '최근 경기';
  }
  players = [].concat.apply([], players);
  console.log(players);
  getTeams = lib.GetTeam(teams);
  getPlayers = lib.GetPlayer(players);
  for (i in result) {
    var ctr = 0;
    while (result[i].home_logo == null || result[i].away_logo == null) {
      if (result[i].home == getTeams[ctr].team) {
        result[i].home_logo = getTeams[ctr].teamPic;
        result[i].home_rank = getTeams[ctr].rank;
        result[i].home_win = getTeams[ctr].win;
        result[i].home_draw = getTeams[ctr].draw;
        result[i].home_loss = getTeams[ctr].loss;
        result[i].home_pts = getTeams[ctr].points;
        result[i].homeLastFive = getTeams[ctr].lastFive;
      } else if (result[i].away == getTeams[ctr].team) {
        result[i].away_logo = getTeams[ctr].teamPic;
        result[i].away_rank = getTeams[ctr].rank;
        result[i].away_win = getTeams[ctr].win;
        result[i].away_draw = getTeams[ctr].draw;
        result[i].away_loss = getTeams[ctr].loss;
        result[i].away_pts = getTeams[ctr].points;
        result[i].awayLastFive = getTeams[ctr].lastFive;
      }
      ctr++;
    }
    if ($vivContext.handsFree == true && result[i].matchResult) {
      if (result[i].league == '리그 1') {
        result[i].hfLeague = '리그 앙';
      } else {
        result[i].hfLeague = result[i].league;
      }
      let myTeam = getPlayers[0].team;
      result[i].hfTeam = myTeam;
      let formatDate = result[i].date.split('/')
      result[i].hfDate = formatDate[0] + '월 ' + formatDate[1].split('(')[0] + '일'
      if (result[i].home == myTeam) {
        result[i].hfOpp = result[i].away;
      } else {
        result[i].hfOpp = result[i].home;
      }
      let homeScore = result[i].matchResult.home.score;
      let awayScore = result[i].matchResult.away.score;
      if (homeScore > awayScore) {
        result[i].hfWinningScore = homeScore;
        result[i].hfLosingScore = awayScore;
      } else {
        result[i].hfWinningScore = awayScore;
        result[i].hfLosingScore = homeScore;
      }
    }
    result[i].playerInfo = [];
    if (Array.isArray(result[i].playerName)) {
      for (j in getPlayers) {
        if (lib.IsIn(getPlayers[j].name, result[i].playerName)) {
          result[i].playerInfo.push({
            'playerName': getPlayers[j].name,
            'playerPic': getPlayers[j].profPic,
            'matchesPlayed': getPlayers[j].matchesPlayed,
            'goals': getPlayers[j].goal,
            'assists': getPlayers[j].assist
          });
        }
      }
    } else {
      for (j in getPlayers) {
        if (getPlayers[j].name == result[i].playerName) {
          result[i].playerInfo.push({
            'playerName': getPlayers[j].name,
            'playerPic': getPlayers[j].profPic,
            'matchesPlayed': getPlayers[j].matchesPlayed,
            'goals': getPlayers[j].goal,
            'assists': getPlayers[j].assist
          });
          break
        }
      }
    }
  }
  console.log(result)
  return result
}
