var request = require('request'),
	fs = require('fs'),
	$ = require('cheerio'),
	moment = require('moment');

var options = {
	url: "http://api.seatgeek.com/2/events?per_page=100&performers[home_team].slug=TEAM-HERE"
};

function firstrun(error, response, body) {
  if (!error && response.statusCode == 200) {
    var info = JSON.parse(body);
    var season = [];

    $(info.events).each(function(i) {
		var today = moment();
		var date = new Date(info.events[i].datetime_local);
		var daysaway = Math.abs(today.diff(date, 'days'));
		var opponent;

		$(info.events[i].performers).map(function(i, el) {
			if (el.away_team == true) {
		  		opponent = el.name;
			}
		});

		var game = {};

		game.date = moment(date).format("MMM D YYYY");
		game.opponent = opponent;
		game[daysaway + "_days_away"] = info.events[i].stats.average_price

		season.push(game);
	});

	fs.writeFile('output.json', JSON.stringify(season, null, 2), function (err) {
		  if (err) return console.log(err);
		  console.log('file written');
	});

  } else {
  	console.log("Error: " + error)
  }
}

function callback(error, response, body) {
  if (!error && response.statusCode == 200) {
	var seatgeekResponse = JSON.parse(body);
	var season = [];

	fs.readFile('output.json', 'utf8', function (err,data) {
		if (err) {
			request(options, firstrun);
		} else {
			var s3response = JSON.parse(data.toString('utf-8'));

			$(seatgeekResponse.events).each(function(i) {
				var today = moment();
				var date = new Date(seatgeekResponse.events[i].datetime_local);
				var formatteddate = moment(date).format("MMM D YYYY");
				var daysaway = Math.abs(today.diff(date, 'days'));

				var findgame = $(s3response).map(function(i, game) {
				  	if(game.date == formatteddate) { 
				  		return game;
				  	}
				});
				
				findgame[0][daysaway + "_days_away"] = seatgeekResponse.events[i].stats.average_price;
			});

			season = s3response;

			fs.writeFile('output.json', JSON.stringify(season, null, 2), function (err) {
			  if (err) return console.log(err);
			  console.log('file written');
			});
		}
	});

	}
}

request(options, callback);

