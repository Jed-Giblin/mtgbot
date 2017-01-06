var Mtgbot = require("./lib/Mtgbot")

const Events = Mtgbot.Events;
var config = require("./config.json")
const bot = new Mtgbot(config,{autoReconnect:true});


bot.connect({
        token: bot.config.token
});

bot.Dispatcher.on(Events.GATEWAY_READY, e => {
        console.log('Connected as ' + bot.User.username );
});

bot.Dispatcher.on(Events.MESSAGE_CREATE, e=> {
	var match = e.message.content.match(/!mtg "(.*)"$/)
	if ( match && match.length > 0 ) { 
		console.log('card name: ' + match[1])
		bot.apiQuery(match[1], e.message.channel);
	}
		
});

