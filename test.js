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
    if(verbose) console.log('err, result = ', err, result);
});

client.FlightInfo({ 
    ident: "N415PW", 
    howMany: 1
}, function(err, result) {
    if(verbose) console.log('err, result = ', err, result);
});

client.FlightInfoEx({ 
    ident: "N415PW", 
    howMany: 1
}, function(err, result) {
    if(verbose) console.log('err, result = ', err, result);
});

client.GetAlerts(function(err, result) {
    if(verbose) console.log('err, result = ', err, result);
});

client.GetFlightID({ 
    ident: 'N415PW', 
    departureTime: '1442008560' 
}, function(err, result) {
    if(verbose) console.log('err, result = ', err, result);
});

client.GetHistoricalTrack('N415PW@1442008560', function(err, result) {
    if(verbose) console.log('err, result = ', err, result);
});

client.GetLastTrack('N415PW', function(err, result) {
    if(verbose) console.log('err, result = ', err, result);
});

client.InboundFlightInfo('N415PW-1457118526-1-0', function(err, result) {
    if(verbose) console.log('err, result = ', err, result);
});

client.InFlightInfo('N415PW', function(err, result) {
    if(verbose) console.log('err, result = ', err, result);
});

client.LatLongsToDistance({ 
    lat1: 37.3626667,
    lon1: -121.9291111,
    lat2: 33.9425003,
    lon2: -118.4080736,
}, function(err, result) {
    if(verbose) console.log('err, result = ', err, result);
});

client.LatLongsToHeading({ 
    lat1: 37.3626667,
    lon1: -121.9291111,
    lat2: 33.9425003,
    lon2: -118.4080736,
}, function(err, result) {
    if(verbose) console.log('err, result = ', err, result);
});

client.MapFlight({
    ident: 'N415PW',
    mapHeight: 32,
    mapWidth: 32,
}, function(err, result) {
    if(verbose) console.log('err, result = ', err, result);
});

client.MapFlightEx({
    faFlightID: 'SKW2494@1442040480',
    mapHeight: 32,
    mapWidth: 32,
    show_data_blocks: true,
    show_airports: true,
    airports_expand_view: true,
}, function(err, result) {
    if(verbose) console.log('err, result = ', err, result);
});
