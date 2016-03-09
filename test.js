// Local developer configuration ...
var config = require('./config');

var FlightAware = require('./flightaware');
var client = new FlightAware(config.username, config.apiKey);

var verbose = true;

var tests = [
    'AircraftType',
    'AirlineFlightInfo',
    'AirlineFlightSchedules',
    'AirlineInfo',
    'AirlineInsight',
    'AirportInfo',
    'AllAirlines',
    'AllAirports',
    'Arrived',
    'BlockIdentCheck',
    'CountAirportOperations',
    'CountAllEnrouteAirlineOperations',
    'DecodeFlightRoute',
    'DecodeRoute',
    'DeleteAlert',
    'Departed',
    'FleetArrived',
    'FleetScheduled',
    'FlightInfo',
    'FlightInfoEx',
    'GetAlerts',
    'GetFlightID',
    'GetHistoricalTrack',
    'GetLastTrack',
    'InboundFlightInfo',
    'InFlightInfo',
    'LatLongsToDistance',
    'LatLongsToHeading',
    'MapFlight',
    'MapFlightEx',
    'Metar',
    'MetarEx',
    'NTaf',
    'RegisterAlertEndpoint',
    'RoutesBetweenAirports',
    'RoutesBetweenAirportsEx',
    'Scheduled',
    'Search',
    'SearchCount',
    'SetMaximumResultSize',
    'Taf',
    'TailOwner',
    'ZipcodeInfo',
];

for(var i in tests) {

    switch(tests[i]) {
        case 'AircraftType':
            client.AircraftType('GALX', function(err, result) {
                if(verbose) console.log('err, result = ', err, result);
            });
            break;

        case 'AirlineFlightInfo':
            client.AirlineFlightInfo('N415PW@1442008560', function(err, result) {
                if(verbose) console.log('err, result = ', err, result);
            });
            break;

        case 'AirlineFlightSchedules':
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
            break;

        case 'AirlineInfo':
            client.AirlineInfo('UAL', function(err, result) {
                if(verbose) console.log('err, result = ', err, result);
            });
            break;

        case 'AirlineInsight':
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
            break;

        case 'AirportInfo':
            client.AirportInfo('SFO', function(err, result) {
                if(verbose) console.log('err, result = ', err, result);
            });
            break;

        case 'AllAirlines':
            client.AllAirlines(function(err, result) {
                if(verbose) console.log('err, result = ', err, result);
            });
            break;

        case 'AllAirports':
            client.AllAirports(function(err, result) {
                if(verbose) console.log('err, result = ', err, result);
            });
            break;

        case 'Arrived':
            client.Arrived({ airport: "KSFO", howMany: 1 }, function(err, result) {
                if(verbose) console.log('err, result = ', err, result);
            });
            break;

        case 'BlockIdentCheck':
            client.BlockIdentCheck("N415PW", function(err, result) {
                if(verbose) console.log('err, result = ', err, result);
            });
            break;

        case 'CountAirportOperations':
            client.CountAirportOperations("KSFO", function(err, result) {
                if(verbose) console.log('err, result = ', err, result);
            });
            break;

        case 'CountAllEnrouteAirlineOperations':
            client.CountAllEnrouteAirlineOperations(function(err, result) {
                if(verbose) console.log('err, result = ', err, result);
            });
            break;

        case 'DecodeFlightRoute':
            client.DecodeFlightRoute('N415PW@1442008560', function(err, result) {
                if(verbose) console.log('err, result = ', err, result);
            });
            break;

        case 'DecodeRoute':
            client.DecodeRoute({ 
                origin: 'KSQL', 
                route: 'SJC V334 SAC SWR', 
                destination: 'KTRK'
            }, function(err, result) {
                if(verbose) console.log('err, result = ', err, result);
            });
            break;

        case 'DeleteAlert':
            client.DeleteAlert('1', function(err, result) {
                if(verbose) console.log('err, result = ', err, result);
            });
            break;

        case 'Departed':
            client.Departed({ 
                airport: "KSFO", 
                howMany: 1
            }, function(err, result) {
                if(verbose) console.log('err, result = ', err, result);
            });
            break;

        case 'FleetArrived':
            client.FleetArrived({ 
                fleet: "URF", 
                howMany: 1 
            }, function(err, result) {
                if(verbose) console.log('err, result = ', err, result);
            });
            break;

        case 'FleetScheduled':
            client.FleetScheduled({ 
                fleet: "URF", 
                howMany: 1 
            }, function(err, result) {
                if(verbose) console.log('err, result = ', err, result);
            });
            break;

        case 'FlightInfo':
            client.FlightInfo({ 
                ident: "N415PW", 
                howMany: 1
            }, function(err, result) {
                if(verbose) console.log('err, result = ', err, result);
            });
            break;

        case 'FlightInfoEx':
            client.FlightInfoEx({ 
                ident: "N415PW", 
                howMany: 1
            }, function(err, result) {
                if(verbose) console.log('err, result = ', err, result);
            });
            break;

        case 'GetAlerts':
            client.GetAlerts(function(err, result) {
                if(verbose) console.log('err, result = ', err, result);
            });
            break;

        case 'GetFlightID':
            client.GetFlightID({ 
                ident: 'N415PW', 
                departureTime: '1442008560' 
            }, function(err, result) {
                if(verbose) console.log('err, result = ', err, result);
            });
            break;

        case 'GetHistoricalTrack':
            client.GetHistoricalTrack('N415PW@1442008560', function(err, result) {
                if(verbose) console.log('err, result = ', err, result);
            });
            break;

        case 'GetLastTrack':
            client.GetLastTrack('N415PW', function(err, result) {
                if(verbose) console.log('err, result = ', err, result);
            });
            break;

        case 'InboundFlightInfo':
            client.InboundFlightInfo('N415PW-1457118526-1-0', function(err, result) {
                if(verbose) console.log('err, result = ', err, result);
            });
            break;

        case 'InFlightInfo':
            client.InFlightInfo('N415PW', function(err, result) {
                if(verbose) console.log('err, result = ', err, result);
            });
            break;

        case 'LatLongsToDistance':
            client.LatLongsToDistance({ 
                lat1: 37.3626667,
                lon1: -121.9291111,
                lat2: 33.9425003,
                lon2: -118.4080736,
            }, function(err, result) {
                if(verbose) console.log('err, result = ', err, result);
            });
            break;

        case 'LatLongsToHeading':
            client.LatLongsToHeading({ 
                lat1: 37.3626667,
                lon1: -121.9291111,
                lat2: 33.9425003,
                lon2: -118.4080736,
            }, function(err, result) {
                if(verbose) console.log('err, result = ', err, result);
            });
            break;

        case 'MapFlight':
            client.MapFlight({
                ident: 'N415PW',
                mapHeight: 32,
                mapWidth: 32,
            }, function(err, result) {
                if(verbose) console.log('err, result = ', err, result);
            });
            break;

        case 'MapFlightEx':
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
            break;

        case 'Metar':
            client.Metar('KSFO', function(err, result) {
                if(verbose) console.log('err, result = ', err, result);
            });
            break;

        case 'MetarEx':
            client.MetarEx({
                airport: 'KSFO', 
                howMany: 1,
            }, function(err, result) {
                if(verbose) console.log('err, result = ', err, result);
            });
            break;

        case 'NTaf':
            client.NTaf('KSFO', function(err, result) {
                if(verbose) console.log('err, result = ', err, result);
            });
            break;

        case 'RegisterAlertEndpoint':
            client.RegisterAlertEndpoint({
                address: 'http://www.example.com', 
                format_type: 'json/post',
            }, function(err, result) {
                if(verbose) console.log('err, result = ', err, result);
            });
            break;

        case 'RoutesBetweenAirports':
            client.RoutesBetweenAirports({
                origin: 'KSFO', 
                destination: 'KLAX',
            }, function(err, result) {
                if(verbose) console.log('err, result = ', err, result);
            });
            break;

        case 'RoutesBetweenAirportsEx':
            client.RoutesBetweenAirportsEx({
                origin: 'KSFO', 
                destination: 'KLAX',
                howMany: 1,
            }, function(err, result) {
                if(verbose) console.log('err, result = ', err, result);
            });
            break;

        case 'Scheduled':
            client.Scheduled({
                airport: 'KSFO', 
                howMany: 1,
            }, function(err, result) {
                if(verbose) console.log('err, result = ', err, result);
            });
            break;

        case 'Search':
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
            break;

        case 'SearchBirdseyeInFlight':
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
            break;

        case 'SearchBirdseyePositions':
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
            break;

        case 'SearchCount':
            client.SearchCount({
                query: '-destination KLAX -prefix H',
                howMany: 1,
            }, function(err, result) {
                if(verbose) console.log('err, result = ', err, result);
            });
            break;

        case 'SetAlert':
            // XXX:  need to create a SetAlert test
            break;

        case 'SetMaximumResultSize':
            client.SetMaximumResultSize(100, function(err, result) {
                if(verbose) console.log('err, result = ', err, result);
            });
            break;

        case 'Taf':
            client.Taf('KSFO', function(err, result) {
                if(verbose) console.log('err, result = ', err, result);
            });
            break;

        case 'TailOwner':
            client.TailOwner('N415PW', function(err, result) {
                if(verbose) console.log('err, result = ', err, result);
            });
            break;

        case 'ZipcodeInfo':
            client.ZipcodeInfo('95060', function(err, result) {
                if(verbose) console.log('err, result = ', err, result);
            });
            break;

        default:
            console.log("Unimplemented API test:", tests[i]);
            break;
    }
}
