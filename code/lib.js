var http = require('http')
var console = require('console');
var config = require('config');

module.exports.SavePreference = function(preference,userId) {
  let params = {
    'userId': userId,
    'preference': preference
  };
  let options = {
    passAsJson: true,
    format: 'json',
    cacheTime: 5000
  };
  return http.putUrl(config.get('remote.url')+'/users/'+userId,params,options);
}

module.exports.GetPreference = function(userId) {
  let options = {
    query: {
      userId: userId
    },
    format: 'json',
    cacheTime: 5000
  }
  return http.getUrl(config.get('remote.url')+'/users',options);
}

module.exports.GetMatches = function(period) {
  return http.getUrl(config.get('remote.url')+period,{format: 'json',cacheTime: 5000});
}

module.exports.GetSchedule = function(playerTeam) {
  player = encodeURI(playerTeam)
  return http.getUrl(config.get('remote.url')+'/matches/'+player,{format: 'json',cacheTime: 5000});
}

module.exports.GetStandings = function(options) {
  return http.getUrl(config.get('remote.url')+'/standings',options);
}

module.exports.GetUEFA = function() {
  return http.getUrl(config.get('remote.url')+'/champions',{format: 'json', cacheTime: 5000});
}

module.exports.GetPlayers = function() {
  return http.getUrl(config.get('remote.url')+'/players',{format: 'json', cacheTime: 5000});
}

module.exports.GetTeam = function(team) {
  options = {
    format: 'json',
    query: {
      'team': team
    },
    cacheTime: 5000
  }
  return http.getUrl(config.get('remote.url')+'/standings', options);
}

module.exports.GetPlayer = function(player) {
  options = {
    format: 'json',
    query: {
      'name': player
    },
    cacheTime: 5000
  }
  return http.getUrl(config.get('remote.url')+'/players', options);
}

module.exports.GetMatch = function(matchID) {
  options = {
    format: 'json',
    query: {
      'matchID': matchID
    },
    cacheTime: 5000
  }
  return http.getUrl(config.get('remote.url')+'/matches', options);
}

module.exports.GetLeg = function(league,playerName,game) {
  otherLeg = Math.abs(parseInt(game) - 3);
  options = {
    format: 'json',
    query: {
      'league': league,
      'playerName': playerName,
      'game': otherLeg,
    },
    cacheTime: 5000
  }
  return http.getUrl(config.get('remote.url')+'/matches', options);
}

module.exports.IsIn = function(value, array) {
  if (typeof value == "object") {
    for (i in value) {
      if (array.indexOf(value[i]) > -1) {
        return true;
      }
    }
    return false;
  } else {
    return array.indexOf(value) > -1;
  }
}