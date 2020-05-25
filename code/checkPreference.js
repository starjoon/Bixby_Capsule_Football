var lib = require('./lib.js')
var config = require('config');
var console = require('console');

let result = [];

module.exports.function = function checkPreference (search,$vivContext) {
  try {
    savedpref = lib.GetPreference($vivContext.bixbyUserId)[0].preference;
    console.log('User Registered');
  }
  catch (err) {
    console.log('User Not Registered')
    return result
  };

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
