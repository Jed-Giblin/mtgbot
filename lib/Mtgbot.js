'use strict'
var Discordie = require('discordie');
var http = require('http');
class Mtgbot extends Discordie{
	constructor(config) {
		super();
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
	text.push(card.name)
	text.push(card.editions[0].image_url)
	text.push('Also found:')
	for ( var c of body ) { 
		text.push(c.name)
	}
	channel.sendMessage(text, [], false)
}
module.exports = Mtgbot;

