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

client.AirlineFlightSchedules({ howMany: 1 }, function(err, result) {
    console.log('err, result = ', err, result);
    if(result && result.data) {
        var schedules = result.data;
        for(var i in schedules) {
            console.log('schedule = ', schedules[i]);
        }
    }
});

client.AirlineInfo('UAL', function(err, result) {
    console.log('err, result = ', err, result);
});

client.AirlineInsight({ origin: 'SJC', destination: 'LAX' }, function(err, result) {
    console.log('err, result = ', err, result);
    if(result && result.data) {
        var insights = result.data;
        for(var i in insights) {
            console.log('insight = ', insights[i]);
        }
    }
});


