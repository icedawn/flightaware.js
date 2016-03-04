// Local developer configuration ...
var config = require('./config');

var FlightAware = require('./flightaware');
var client = new FlightAware(config.username, config.apiKey);

client.AircraftType('GALX', function(err, result) {
    console.log('err, result = ', err, result);
});

client.AirlineFlightInfo('N415PW@1442008560', function(err, result) {
    console.log('err, result = ', err, result);
});

