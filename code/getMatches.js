var lib = require('./lib.js')
var config = require('config');
var console = require('console');
var fail = require('fail');

let result = [];
// let test = {fixtures:[]};

module.exports.function = function getMatches (period,fixture,$vivContext) {
  var permissions = $vivContext.grantedPermissions;
  console.log(permissions)
  console.log($vivContext.bixbyUserId)
  try {
    savedpref = lib.GetPreference($vivContext.bixbyUserId)[0].preference;
    console.log('User Registered');
  }
  catch (err) {
    console.log($vivContext.device)
    console.log($vivContext.handsFree)
    console.log('User Not Registered')
    if ($vivContext.device != 'bixby-mobile') {
      throw fail.checkedError('유저가 등록되어있지 않습니다, 모바일에서 등록해주세요.', 'RegisterOnMobile', null);
    } else {
      throw fail.checkedError('유저가 등록되어있지 않습니다.', 'UserNotRegistered', null);
    }
  }

  if (period == "이번주") {
    value = "/this"
  } else if (period == "지난주") {
    value = "/last"
  } else if (period == "다음주") {
    value = "/next"
  }

  matches = lib.GetMatches(value);
  let teams = [];
  let players = [];
  if (matches.length == 0) {
    console.log('No matches scheduled');
    // if (period == "이번주") {
    //   result.push({"week":"this"});
    // } else if (period == "지난주") {
    //   result.push({"week":"last"});
    // } else if (period == "다음주") {
    //   result.push({"week":"next"});
    // };
    return result
  }
  for (i in matches) {
    result[i] = matches[i];
    if (result[i].matchProgress != null) {
      matchTime = result[i].matchProgress.time;
      result[i].matchProgress.timeProp = Math.round(matchTime/90*100)
    }
    if (lib.IsIn(matches[i].playerName,savedpref)) {
      console.log('favorite player');
      result[i].highlight = 1;
    } else {
      console.log('regular');
      result[i].highlight = 0;
    }
    teams.push(matches[i].home);
    teams.push(matches[i].away);
    players.push(matches[i].playerName);
  }
  players = [].concat.apply([],players)
  getTeams = lib.GetTeam(teams);
  getPlayers = lib.GetPlayer(players);
  for (i in result) {
    // test.fixtures.push(result[i]);
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
    result[i].playerInfo = []
    if (Array.isArray(result[i].playerName)) {
      for (j in getPlayers) {
        if (lib.IsIn(getPlayers[j].name,result[i].playerName)) {
          result[i].playerInfo.push({
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
        if (getPlayers[j].name == result[i].playerName) {
          result[i].playerInfo.push({
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
  }
  console.log(result)
  return result
}
