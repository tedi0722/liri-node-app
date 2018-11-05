require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var inquirer = require('inquirer');
var omdb = require('omdb');
var bandsintown = require('bandsintown');
var moment = require('moment');
var request = require('request');
var fs = require('fs');
var action = process.argv[2];
var value  = process.argv[3]



switch (action) {
    
    case "concert-this":
        concertThis (value);
        break;

    case "spotify-this-song":
        spotifyThisSong (value);
        break;

    case "movie-this":
        movieThis (value);
        break;
    
    case "do-what-it-says":
        doWhatItSays ();
        break;
};

function concertThis (value) {

    var queryUrl = "https://rest.bandsintown.com/artists/" + value + "/events?app_id=codingbootcamp";
    request(queryUrl, function (error, response, body) {
        var concertObj = JSON.parse(body);
        if (error) {
            console.log("Error: " + error);
        } else {
            for (var i = 0; i < concertObj.length; i++) {
                console.log("\n");
                console.log("Venue: " + concertObj[i].venue.name);
                console.log("Location: " + concertObj[i].venue.country + ", " + concertObj[i].venue.region + ", " + concertObj[i].venue.city);
                console.log("Date: " + moment(concertObj[i].datetime).format('L') );
                console.log("\n");
            };
        }
    });
}

function spotifyThisSong (value) {

    var defaultSong = "The Sign";

    if (!value) {
        value = defaultSong;
    };

    spotify.search({
        type: "track",
        query: value,
        limit: 5
        }, function (err, data) {

            if (err) {
                console.log("Error: " + err);
                return;
            } else {
                for (var i = 0; i < 5; i++) {
                    console.log("\n")
                    console.log("Artist: " + data.tracks.items[i].artists[0].name);
                    console.log("Song: " + data.tracks.items[i].name);
                    console.log("Preview URL: " + data.tracks.items[i].preview_url);
                    console.log("Album: " + data.tracks.items[i].album.name);
                    console.log("\n");
                };
            };
        });
};

function movieThis (value) {

    var defaultMovie = "Mr. Nobody";

    if (!value) {
        value = defaultMovie;
    };

    var queryUrl = "http://www.omdbapi.com/?t=" + value + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function (error, response, body) {

        if (error) {
            console.log("Error: " + error);
        };

        var movieObj = JSON.parse(body);
        console.log("\n")
        console.log("Title: " + (movieObj.Title));
        console.log("Year: " + (movieObj.Year));
        console.log("IMDB Rating: " + (movieObj.Ratings[0].Value));
        console.log("Rotten Tomatoes Rating: " + (movieObj.Ratings[1].Value));
        console.log("Country: " + (movieObj.Country));
        console.log("Language: " + (movieObj.Language));
        console.log("Plot: " + (movieObj.Plot));
        console.log("Actors: " + (movieObj.Actors));
        console.log("\n")
    });
}

function doWhatItSays () {

    inquirer
        .prompt([
            {
                type: "list", 
                message: "Choose a command!",
                choices: ["concert-this", "spotify-this-song", "movie-this"],
                name: "action"
            },
            {
                type: "input",
                message: "Enter Value",
                name: "value"
            }
        ]).then(function(inquirerResponse) {
            
                var data = inquirerResponse.action + ", " + JSON.stringify(inquirerResponse.value)

            fs.writeFile('random.txt', data, function(err) {

                var dataArr = data.split(',');

                if (err) {
                    console.log("Error: " + err);
                } else if (dataArr[0] === "concert-this") {
                    dataArr[0] = process.argv[2];
                    concertThis(dataArr[1]);
                } else if (dataArr[0] === "spotify-this-song") {
                    dataArr[0] = process.argv[2];
                    spotifyThisSong(dataArr[1]);
                } else if (dataArr[0] === "movie-this") {
                    dataArr[0] = process.argv[2];
                    movieThis(dataArr[1]);
                }
                
            });
        });

    
}