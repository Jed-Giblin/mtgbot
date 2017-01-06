'use strict'
var Discordie = require('discordie');
var http = require('http');
class Mtgbot extends Discordie{
	constructor(config) {
		super({autoReconnect: true});
		console.log(this.autoReconnect + ' is a ')
		this.config = config;
	}
	apiQuery(string, channel) {
		var enc = encodeURI('/mtg/cards?name="' + string + '"');
		return http.get({
			host: 'api.deckbrew.com',
			path: enc,
		}, function(response) {
			var body = '';
			response.on('data',function(d) {
				body +=d;
			});
			response.on('end', function() {
				var json = JSON.parse(body);
				collate(json,channel);
			});
		});
	}
}
var collate = function(body,channel) {
	var card = body.shift();
	var text = []
	if ( ! card ) { 
		channel.sendMessage('No Cards Found');
		return;
	}	
	var url = card.editions[0].image_url
	if ( url == 'https://image.deckbrew.com/mtg/multiverseid/0.jpg' ) { 
		console.log('switching to last')
		var last = card.editions.length-1
		url = card.editions[last].image_url
	}
	text.push(card.name)
	text.push(url)
	// var embed = { 
	//	url: url,
	//	type: 'image',
	//	title: card.name,
	//	thumbnail: {
	//		width: 200,
	//		height: 300,
	//		url: url,
	//		proxy_url: url
	//	}
	//}
	var i = 1
	for ( var c of body ) { 
		var url1 = c.editions[0].image_url
		if ( url1 == 'https://image.deckbrew.com/mtg/multiverseid/0.jpg' ) {
			console.log('switching to last')
			var last = c.editions.length-1
			url = c.editions[last].image_url
		}
		text.push(c.name + ' - ' + url1)
		i = i+1
		if ( i >= 5 ) { 
			text.push('Found greater then 5 cards');
			break
		}
	}
	console.log(text);
	// console.log(embed);
	channel.sendMessage(text, [], false)
}
module.exports = Mtgbot;

