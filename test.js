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

client.Metar('KSFO', function(err, result) {
    if(verbose) console.log('err, result = ', err, result);
});

client.MetarEx({
    airport: 'KSFO', 
    howMany: 1,
}, function(err, result) {
    if(verbose) console.log('err, result = ', err, result);
});

client.NTaf('KSFO', function(err, result) {
    if(verbose) console.log('err, result = ', err, result);
});

client.RegisterAlertEndpoint({
    address: 'http://www.example.com', 
    format_type: 'json/post',
}, function(err, result) {
    if(verbose) console.log('err, result = ', err, result);
});

client.RoutesBetweenAirports({
    origin: 'KSFO', 
    destination: 'KLAX',
}, function(err, result) {
    if(verbose) console.log('err, result = ', err, result);
});

client.RoutesBetweenAirportsEx({
    origin: 'KSFO', 
    destination: 'KLAX',
    howMany: 1,
}, function(err, result) {
    if(verbose) console.log('err, result = ', err, result);
});

client.Scheduled({
    airport: 'KSFO', 
    howMany: 1,
}, function(err, result) {
    if(verbose) console.log('err, result = ', err, result);
});

var searchQueries = [
    { "type" : "B77*" },
    { "belowAltitude" : 100, "aboveGroundspeed" : 200 },
    { "destination" : "KLAX", "prefix" : "H" },
    { "idents" : "UAL*", "type" : "B73*" },
];

for(var i in searchQueries) {
    client.Search({
        parameters: searchQueries[i],
        howMany: 1,
    }, function(err, result) {
        if(verbose) console.log('err, result = ', err, result);
    });
}

client.Search({
    query: '-destination KLAX -prefix H',
    howMany: 1,
}, function(err, result) {
    if(verbose) console.log('err, result = ', err, result);
});

var inFlightQueries = [
    [ "{< alt 100} {> gs 200}", "All aircraft below ten-thousand feet with a groundspeed over 200 kts" ],
    [ "{match aircraftType B77*}", "All in-air Boeing 777s" ],
    [ "{= dest KLAX} {= prefix H}", "All aircraft heading to Los Angeles International Airport (LAX) that are \"heavy\" aircraft" ],
    [ "{match ident UAL*} {match aircraftType B73*}", "All United Airlines flights in Boeing 737s" ],
    [ "{true lifeguard}", "All \"lifeguard\" rescue flights" ],
    [ "{in orig {KLAX KBUR KSNA KLGB KVNY KSMO KLGB KONT}} {in dest {KJFK KEWR KLGA KTEB KHPN}}", "All flights between Los Angeles area and New York area" ],
    [ "{range lat 36.897669 40.897669} {range lon -79.03655 -75.03655}", "All flights with a last reported position +/- 2 degrees of the Whitehouse" ],
    [ "{> lastPositionTime 1278610758} {true inAir} {!= physClass P} {> circles 3}", "All flights that have a reported position after a specified epoch time, are still in the air, are not piston class, and have made several circular flight patterns (potentially in distress)" ],
];

for(var i in inFlightQueries) {
    var query = inFlightQueries[i][0];
    client.SearchBirdseyeInFlight({
        query: query,
        howMany: 1,
    }, function(err, result) {
        if(verbose) console.log('err, result = ', err, result);
    });
}

var positionQueries = [
    [ "{< alt 100} {> gs 200}", "All flight positions below ten-thousand feet with a groundspeed over 200 kts" ],
    [ "{match fp ASA*}", "All Alaska Airlines flight positions" ],
    [ "{match fp ASA*} {> lat 45}", "All Alaska Airlines flight positions north of the 45th parallel" ],
    [ "{range lat 36.897669 40.897669} {range lon -79.03655 -75.03655}", "All flight positions +/- 2 degrees of the lat/lon of the Whitehouse" ],
    [ "{= fp N415PW-1442008613-adhoc-0}", "All flight positions for a specific flight identifier (faFlightID)" ],
];

for(var i in positionQueries) {
    var query = positionQueries[i][0];
    client.SearchBirdseyePositions({
        query: query,
        uniqueFlights: true,
        howMany: 1,
    }, function(err, result) {
        if(verbose) console.log('err, result = ', err, result);
    });
}

client.SearchCount({
    query: '-destination KLAX -prefix H',
    howMany: 1,
}, function(err, result) {
    if(verbose) console.log('err, result = ', err, result);
});

// XXX:  need to create a SetAlert test

client.SetMaximumResultSize(100, function(err, result) {
    if(verbose) console.log('err, result = ', err, result);
});

client.Taf('KSFO', function(err, result) {
    if(verbose) console.log('err, result = ', err, result);
});

client.TailOwner('N415PW', function(err, result) {
    if(verbose) console.log('err, result = ', err, result);
});


client.ZipcodeInfo('95060', function(err, result) {
    if(verbose) console.log('err, result = ', err, result);
});


