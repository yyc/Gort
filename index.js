var Bot = require('node-telegram-bot');
var google=require("google");
var getJoke=require("./jokes");
google.resultsPerPage=10;

botToken=process.argv[2];

var bot = new Bot({
  token: botToken
})
.on('message', function (message) {
  if(message.text){
    if(message.text[0]=="/"){
      command=message.text.split(" ",1)[0].substr(1); // splits out the command from a message starting with /
      switch(command){
        case "help":
          bot.sendMessage({
            chat_id: message.chat.id
            , text: "Hi, I'm Gort, your plastic pal who's fun to be with! You can summon me with the following commands:\n/help: This help message\n/respond <question_id> response: Submit your response to a question [WIP]"
          });
        break;
        case "signup":
          
        break;
        case "respond":
        
        break;
        case "google":
        
        break;
        case "joke":
          var joke=getJoke();
          bot.sendMessage({
            chat_id: message.chat.id
            , text: joke["setup"]
          }).then(function(){
            bot.sendMessage({
              chat_id: message.chat.id
              , text: joke["punchline"]
            });
          });
        break;
      }
    }
    if(message.text.indexOf("hi")!=-1){
      bot.sendMessage({
        chat_id: message.chat.id
        , text: "Hi "+message.from.first_name+", I'm GortBot! But you can just call me Gort."
      }).then(function(res){
        console.log(res);
      });
    }    
  }
  console.log(message);
})
.start();

