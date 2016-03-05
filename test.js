// Local developer configuration ...
var config = require('./config');

var FlightAware = require('./flightaware');
var client = new FlightAware(config.username, config.apiKey);

var verbose = false;

client.AircraftType('GALX', function(err, result) {
    // console.log('err, result = ', err, result);
});

client.AirlineFlightInfo('N415PW@1442008560', function(err, result) {
    // console.log('err, result = ', err, result);
});

client.AirlineFlightSchedules({ howMany: 1 }, function(err, result) {
    // console.log('err, result = ', err, result);
    if(result && result.data) {
        var schedules = result.data;
        for(var i in schedules) {
            // console.log('schedule = ', schedules[i]);
        }
    }
});

client.AirlineInfo('UAL', function(err, result) {
    // console.log('err, result = ', err, result);
});

client.AirlineInsight({ origin: 'SJC', destination: 'LAX' }, function(err, result) {
    // console.log('err, result = ', err, result);
    if(result && result.data) {
        var insights = result.data;
        for(var i in insights) {
            // console.log('insight = ', insights[i]);
        }
    }
});

client.AirportInfo('SFO', function(err, result) {
    // console.log('err, result = ', err, result);
});

client.AllAirlines(function(err, result) {
    // console.log('err, result = ', err, result);
});

client.AllAirports(function(err, result) {
    // console.log('err, result = ', err, result);
});

client.Arrived({ airport: "KSFO" }, function(err, result) {
    // console.log('err, result = ', err, result);
});

client.BlockIdentCheck("N415PW", function(err, result) {
    // console.log('err, result = ', err, result);
});

client.CountAirportOperations("KSFO", function(err, result) {
    // console.log('err, result = ', err, result);
});

client.CountAllEnrouteAirlineOperations(function(err, result) {
    console.log('err, result = ', err, result);
});

