var Bot = require('node-telegram-bot');
var google=require("google");
var getJoke=require("./jokes");
var redis=require("then-redis");

google.resultsPerPage=10;

botToken=process.argv[2];

var rd=redis.createClient();

var bot = new Bot({
  token: botToken
});

bot.on('message', function (message) {
  if(message.text){
    if(message.text[0]=="/"){
      command=message.text.split(" ",1)[0].substr(1); // splits out the command from a message starting with /
      switch(command){
        case "help":
          bot.sendMessage({
            chat_id: message.chat.id
            , text: "Hi, I'm Gort, your plastic pal who's fun to be with! You can summon me with the following commands:\n/help: This help message\n/respond <question_id> response: Submit your response to a question [WIP]\n/bind <verb> <"
          });
        break;
        case "signup":
          
        break;
        case "respond":
        
        break;
        case "google":
        
        break;
        case "joke":
          sendJoke(bot,message);
        break;
        case "get":
          //do nothing, but to play nice with imageBot
        break;
        case "getgif":
          //ditto
        break;
        case "bind":
          setBind(bot,message);
        break;
        default:
          checkBinds(bot,message,command);
      }
    }
    else{ //mentions
      if(message.text.indexOf("hi")!=-1){
        bot.sendMessage({
          chat_id: message.chat.id
          , text: "Hi "+message.from.first_name+", I'm GortBot! But you can just call me Gort."
        }).then(function(res){
          console.log(res);
        });
      }
    }
  }
  console.log(message);
})
.start();

function sendJoke(bot,message){
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
}
function setBind(bot,message){
  var index1=message.text.indexOf(" ");
  var index2=message.text.indexOf(" ",index1+1);
  if(index2!=-1){
    verb=message.text.substr(index1+1,index2-index1-1);
    subject=message.text.substr(index2+1);
    if(subject[0]=="/"){
      subject=subject.substr(1);
    }
    if(verb.length&&subject.length){
      rd.set(message.chat.id+"~"+verb,subject).then(function(){
        bot.sendMessage({
          chat_id: message.chat.id
          , text: "Okay! Created bind /"+verb+" to "+subject
        })
      })
    }
  }
}
function checkBinds(bot,message,command){
  rd.get(message.chat.id+"~"+command).then(function(response){
    if(response){
      bot.sendMessage({
        chat_id: message.chat.id
        , text: response
      })
    }
  },function(){
    
  });
}
