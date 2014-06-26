var express = require('express')
var bodyParser = require('body-parser')
var slack = require('./slack-api.js')
var pokeapi = require('./poke-api.js')
var app = express();

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())

app.get('/', function(request, response) {
  response.send('Hello There!')
})

app.post('/commands', function(request, response){
  var commands = request.body.text.split(" ");
  switch(commands[1]) {
    case 'use':
      pokeapi.getPokemon(commands[2], function(json){
        if(json.error) { console.log('error calling the pokemon api') }
        var abilities = [json.abilites[0].name, json.abilities[1].name]
        slack.sendSlackPost({"text":"you chose "+commands[2]+"! Its abilities are "+abilities[0]+" and "+abilities[0]+"."})
      });
      break;
    default:
      slack.sendSlackPost({"text":commands.join(" ")});
  }
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
