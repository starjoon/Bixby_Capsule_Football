var lib = require('./lib.js')
var config = require('config');
var console = require('console');

let result = [];

module.exports.function = function getMatchesPOST (preference,period,fixture,$vivContext) {
  let Pref = [];
  let PlayerPref = {
    0 : "손흥민",
    1 : "황의조",
    2 : "이강인",
    3 : "황희찬",
    4 : "권창훈",
    5 : "이재성",
    6 : "백승호",
    7 : "이승우"
  }
  console.log(preference)

  for (i in preference) {
    if (preference[i] == true) {
      Pref.push(PlayerPref[i])
    }
  }
  console.log(Pref)
  
  try {
    saved = lib.SavePreference(Pref,$vivContext.bixbyUserId);
    console.log(saved);
    savedpref = saved.preference;
    console.log('User Now Registered')
  }
  catch (err) {
    console.log(err)
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
    console.log('No matches scheduled')
    return result
  }
  for (i in matches) {
    result[i]=matches[i];
    if (result[i].matchProgress != null) {
      matchTime = result[i].matchProgress.time;
      result[i].matchProgress.timeProp = Math.round(matchTime/90*100)
    }
    if (lib.IsIn(matches[i].playerName,savedpref)) {
      console.log('yup its here!');
      result[i].highlight = 1;
    } else {
      console.log('nope not here!');
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
