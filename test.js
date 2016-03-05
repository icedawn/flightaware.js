// Local developer configuration ...
var config = require('./config');

var FlightAware = require('./flightaware');
var client = new FlightAware(config.username, config.apiKey);

var verbose = false;

client.AircraftType('GALX', function(err, result) {
    if(verbose) console.log('err, result = ', err, result);
});

client.AirlineFlightInfo('N415PW@1442008560', function(err, result) {
    if(verbose) console.log('err, result = ', err, result);
});

client.AirlineFlightSchedules({
    howMany: 1
}, function(err, result) {
    if(verbose) console.log('err, result = ', err, result);
    if(result && result.data) {
        var schedules = result.data;
        for(var i in schedules) {
            if(verbose) console.log('schedule = ', schedules[i]);
        }
    }
});

client.AirlineInfo('UAL', function(err, result) {
    if(verbose) console.log('err, result = ', err, result);
});

client.AirlineInsight({ 
    origin: 'SJC', 
    destination: 'LAX'
}, function(err, result) {
    if(verbose) console.log('err, result = ', err, result);
    if(result && result.data) {
        var insights = result.data;
        for(var i in insights) {
            if(verbose) console.log('insight = ', insights[i]);
        }
    }
});

client.AirportInfo('SFO', function(err, result) {
    if(verbose) console.log('err, result = ', err, result);
});

client.AllAirlines(function(err, result) {
    if(verbose) console.log('err, result = ', err, result);
});

client.AllAirports(function(err, result) {
    if(verbose) console.log('err, result = ', err, result);
});

client.Arrived({ airport: "KSFO", howMany: 1 }, function(err, result) {
    if(verbose) console.log('err, result = ', err, result);
});

client.BlockIdentCheck("N415PW", function(err, result) {
    if(verbose) console.log('err, result = ', err, result);
});

client.CountAirportOperations("KSFO", function(err, result) {
    if(verbose) console.log('err, result = ', err, result);
});

client.CountAllEnrouteAirlineOperations(function(err, result) {
    if(verbose) console.log('err, result = ', err, result);
});

client.DecodeFlightRoute('N415PW@1442008560', function(err, result) {
    if(verbose) console.log('err, result = ', err, result);
});

client.DecodeRoute({ 
    origin: 'KSQL', 
    route: 'SJC V334 SAC SWR', 
    destination: 'KTRK'
}, function(err, result) {
    if(verbose) console.log('err, result = ', err, result);
});

client.DeleteAlert('1', function(err, result) {
    if(verbose) console.log('err, result = ', err, result);
});

client.Departed({ 
    airport: "KSFO", 
    howMany: 1
}, function(err, result) {
    if(verbose) console.log('err, result = ', err, result);
});

client.FleetArrived({ 
    fleet: "URF", 
    howMany: 1 
}, function(err, result) {
    if(verbose) console.log('err, result = ', err, result);
});

client.FleetScheduled({ 
    fleet: "URF", 
    howMany: 1 
}, function(err, result) {
    if(1) console.log('err, result = ', err, result);
});

