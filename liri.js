require("dotenv").config();
var fs = require("fs");
var keys = require('./keys');
var Spotify = require('node-spotify-api');
var axios = require("axios");
var moment = require('moment');
moment().format();


var inputString = process.argv;
var command = inputString[2];
var searchContent = inputString[3];
var bandsInTown = "https://rest.bandsintown.com/artists/" + searchContent + "/events?app_id=codingbootcamp";

if(command == "do-what-it-says" || command == "Do-What-It-Says" ){
    fs.readFile("random.txt", "utf8", function(error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
        return console.log(error);
        }
    
        // Then split it by commas (to make it more readable)
        var dataArr = data.split(",");
    
        command = dataArr[0];
        searchContent = dataArr[1];
        startApplication();
    });
}

startApplication();

function startApplication(){
    if(command == "concert-this" || command == "Concert-This"){
        concertThis(searchContent);
    }
    if(command == "spotify-this-song" || command == "Spotify-This-Song"){
        spotifySong(searchContent); 
    }
    if(command == "movie-this" || command == "Movie-This" ){
        movieThis(searchContent);
    }
}

function concertThis(){
    // a request to the bandsInTown API with the band specified
    axios.get(bandsInTown).then(
        function(response) {
            for(var j = 0; j <= response.data.length - 1; j++){
                console.log("Name of Venue: " + response.data[j].venue.name);
                console.log("Venue Location: " + response.data[j].venue.city +
                            ", " + response.data[j].venue.region + ", " +
                            response.data[j].venue.country);
                            
                var concertDate = response.data[j].datetime;
                var dateArray = concertDate.split('');
                // console.log(dateArray);
                for(var i = 0; i <= 9; i++){
                    convertedDate = "";
                    convertedDate = convertedDate + dateArray[i];
                    // console.log(convertedDate);
                }

                var randomFormat = "YYYY-MM-DD";
                var convertedDate = moment(concertDate, randomFormat);
                console.log("Date of the Event: " + convertedDate.format("MM/DD/YYYY"));
                console.log("---------------------------------------------");
            }
        }

    );
}   

function spotifySong(song){
    var spotify = new Spotify(keys.spotify);
    if(song == undefined || song == null){
        song = "The Sign";
    }
    spotify.search({ type: 'track', query: song }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
            console.log("Song Name: " + data.tracks.items[0].name); 
            console.log("Album Title: " + data.tracks.items[0].album.name); 
            console.log("Artist(s): " + data.tracks.items[0].artists[0].name);
            console.log("Preview Link: " + data.tracks.items[0].href);  
            console.log("---------------------------------------------");
    });
}   

function movieThis(){
    if(searchContent == undefined || searchContent == null){
        searchContent = "Mr. Nobody";
    }
    axios.get("http://www.omdbapi.com/?t=" + searchContent + "&apikey=trilogy").then(
        function(response) {
            console.log("Title: " + response.data.Title);
            console.log("Year: " + response.data.Year);
            console.log("IMDB Rating: " + response.data.imdbRating);
            console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
            console.log("Country Produced: " + response.data.Country);
            console.log("Language: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);
            console.log("---------------------------------------------");
            }
        );
}
