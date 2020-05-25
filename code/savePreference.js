var lib = require('./lib.js')
var config = require('config');
var console = require('console');

let result = [];

module.exports.function = function savePreference (preference,search,change,$vivContext) {
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

  if (savedpref.length == 0) {
    return result
  };

  allPlayers = lib.GetPlayer(savedpref);
  for (i in allPlayers) {
    result[i] = allPlayers[i];
  }

  console.log(result)
  return result
}
