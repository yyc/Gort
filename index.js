var Bot = require('node-telegram-bot');
var google=require("google");
var redis=require("then-redis");

var getJoke=require("./jokes");
var Poll=require("./polling")

botToken=process.argv[2];

var rd=redis.createClient();
var polld=new Poll(rd);

var bot = new Bot({
  token: botToken
});
var stateObjects={};

bot.on('message', function (message) {
  
  if(message.text){
    if(stateObjects[eventName(message)]){
      stateObjects[eventName(message)].emit("message",bot,message);
      console.log("State event fired");
    }
    else{
      if(message.text[0]=="/"){
        command=message.text.split(" ",1)[0].substr(1); // splits out the command from a message starting with /
        switch(command){
          case "help":
            bot.sendMessage({
              chat_id: message.chat.id
                , text: "Hi, I'm Gort, your plastic pal who's fun to be with! You can summon me with the following commands:\n/help: This help message\n/command </command> <response>\n/trigger <trigger> % <response>"
                ///respond <question_id> response: Submit your response to a question [WIP]
                //
            });
          break;
  //polling
          case "question":
            stateObjects[eventName(message)]=polld.createQuestion(bot,message);
            autoExpire(eventName(message));
          break;
          case "whatis":
          
          break;
          case "respond":
          
          break;
          case "results":
          
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
          case "command":
            setBind(bot,message);
          break;
          case "trigger":
            setTrigger(bot,message);
          break;
          default:
            checkBinds(bot,message,command);
        }
      }
      else if (message.text.indexOf("@GortBot")!=-1){ //Direct mentions
        if(message.text.indexOf("hi")!=-1){
          bot.sendMessage({
            chat_id: message.chat.id
            , text: "Hi "+message.from.first_name+", I'm GortBot! But you can just call me Gort."
          }).then(function(res){
            console.log(res);
          });
        }
      }
      else{
        checkTrigger(bot,message);
      }
    }
  }
  console.log(message);
});
bot.start();


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
    var verb=message.text.substr(index1+1,index2-index1-1).toLowerCase();
    var subject=message.text.substr(index2+1);
    if(subject[0]=="/"){
      subject=subject.substr(1);
    }
    if(verb.length&&subject.length){
      rd.set(message.chat.id+"~binds-"+verb,subject).then(function(){
        bot.sendMessage({
          chat_id: message.chat.id
          , text: "Okay! Created bind /"+verb+" to "+subject
        });
      })
    }
  }
}
function checkBinds(bot,message,command){
  rd.get(message.chat.id+"~binds-"+command.toLowerCase()).then(function(response){
    if(response){
      bot.sendMessage({
        chat_id: message.chat.id
        , text: response
      })
    }
  },function(){
    
  });
}
function setTrigger(bot,message){
  var index1=message.text.indexOf(" ");
  var index2=message.text.indexOf("%");
  if(index2!=-1){
    var trigger=message.text.substr(index1+1,index2-index1-1).toLowerCase().trim();
    var response=message.text.substr(index2+1).trim();
    if(trigger.length&&response.length){
      rd.set(message.chat.id+"~triggers-"+trigger,response).then(function(){
        bot.sendMessage({
          chat_id: message.chat.id
          , text: "Okay! "+trigger+" now triggers "+response
        });
      })
    }
    else{
      bot.sendMessage({
        chat_id: message.chat.id
          ,reply_to_message_id: message.message_id
          , text: "That wasn't in the correct format. Remember, the correct format for the /trigger command is :\n/trigger triggering phrase % response phrase"
      });
    }
  }
  else{
    bot.sendMessage({
      chat_id: message.chat.id
        ,reply_to_message_id: message.message_id
        , text: "That wasn't in the correct format. Remember to separate your trigger and response phrases with a % sign"
    });
  }
}
function checkTrigger(bot,message){
  rd.get(message.chat.id+"~triggers-"+message.text.toLowerCase()).then(function(response){
    if(response){
      bot.sendMessage({
        chat_id: message.chat.id
        , text: response
      })
    }
  },function(){
    
  });
}


//utility functions
function eventName(message){
  return message.chat.id+"~"+message.from.id;
}
function autoExpire(index){
  stateObject[index].on("complete",function(){
    delete stateObject[index];
  });
}