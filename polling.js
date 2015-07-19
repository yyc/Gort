module.exports=Poll;

var rd;
var Questions={};

function Poll(){
  rd=rd;  
}
Poll.prototype.createQuestion=function(bot,message){
  var q = new Question();
  q.init(bot,message);
  return q;
}

function Question(){
  this.question={};
}
Question.prototype.init=function(bot,message){
  this.question.owner=message.from;
  bot.sendMessage({
    chat_id: message.chat.id
      ,reply_to_message_id: message.message_id
      , text: "Please state the nature of your question:\n(the next message you type will be saved as the question's full description and will be showed at the top of responses"
  });
  bot.once(eventName(message),this.setQuestion);
}

Question.prototype.setQuestion=function(bot,message){
//  this.rd.set(message.message_id)
  this.question.description=message.text;
  bot.sendMessage({
    chat_id: message.chat.id
      ,reply_to_message_id: message.message_id
      , text: "Now can you give me a short, one-word label for the event? E.g. nightcycle or pratadinner"
  });
  bot.once(eventName(message),this.setLabel);
}

Question.prototype.setLabel=function(bot,message){
  if(message.text.indexOf(" ")==-1){
    this.question.label=message.text.toLowerCase();
    console.log(this.question);
  }
  else{
    bot.sendMessage({
      chat_id: message.chat.id
        ,reply_to_message_id: message.message_id
        , text: "That contained spaces. Please try again."
    });
    bot.once(eventName(message),this.setLabel);
  }
}



//utility functions
function eventName(message){
  return message.chat.id+"~"+message.from.id;
}