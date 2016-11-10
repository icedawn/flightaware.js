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

var report = function(err, result) {
    it('Returns a valid result', function() {
        expect(err).to.be.null;
        expect(result).to.not.be.null;
    });
    if(err) {
        console.log('err =', err);
    }
    else if(verbose) {
        console.log('result = ', result);
    }
};

for(var i in tests) {
    
    var test = tests[i];

    describe(test, function() {
        switch(test) {
            case 'AircraftType':
                it('looks up GALX aircraft', function() {
                    client.AircraftType('GALX', function(err, result) {
                        expect(err).to.be.null;
                        expect(result).to.not.be.null;
                        expect(result).to.contain.all.keys(['manufacturer', 'type', 'description']);
                    });
                });
                break;

            case 'AirlineFlightInfo':
                var faFlightID = 'N415PW@1442008560';
                it('looks up flight ID '+ faFlightID, function() {
                    client.AirlineFlightInfo('N415PW@1442008560', function(err, result) {
                        expect(err).to.be.null;
                        expect(result).to.not.be.null;
                        expect(result).to.contain.all.keys(['ident']);
                        expect(result.ident).to.equal('N415PW');
                    });
                });
                break;

            case 'AirlineFlightSchedules':
                it('looks up airline flight schedules', function() {
                    client.AirlineFlightSchedules({
                        howMany: 1
                    }, function(err, result) {
                        expect(err).to.be.null;
                        expect(result).to.not.be.null;
                        if(result && result.data) {
                            var schedules = result.data;
                            for(var i in schedules) {
                                if(verbose) console.log('schedule = ', schedules[i]);
                            }
                        }
                    });
                });
                break;

            case 'AirlineInfo':
                it('looks up airline information', function() {
                    client.AirlineInfo('UAL', function(err, result) {
                        expect(err).to.be.null;
                        expect(result).to.not.be.null;
                    });
                });
                break;

            case 'AirlineInsight':
                var origin = 'SJC';
                var destination = 'LAX';
                it('looks up airline traveling from ' + origin + ' to ' + destination, function() {
                    client.AirlineInsight({ 
                        origin: origin,
                        destination: destination
                    }, function(err, result) {
                        expect(err).to.be.null;
                        expect(result).to.not.be.null;
                        if(verbose) console.log('err, result = ', err, result);
                        if(result && result.data) {
                            var insights = result.data;
                            for(var i in insights) {
                                if(verbose) console.log('insight = ', insights[i]);
                            }
                        }
                    });
                });
                break;

            case 'AirportInfo':
                var origin = 'SFO';
                it('looks up airport information for ' + origin, function() {
                    client.AirportInfo(origin, function(err, result) {
                        expect(err).to.be.null;
                        expect(result).to.not.be.null;
                    });
                });
                break;

            case 'AllAirlines':
                it('looks up all airline information', function() {
                    client.AllAirlines(function(err, result) {
                        expect(err).to.be.null;
                        expect(result).to.not.be.null;
                    });
                });
                break;

            case 'AllAirports':
                it('looks up airline information', function() {
                    client.AllAirports(function(err, result) {
                        expect(err).to.be.null;
                        expect(result).to.not.be.null;
                    });
                });
                break;

            case 'Arrived':
                var origin = 'KSFO';
                it('looks up arrival information for ' + origin, function() {
                    client.Arrived({ airport: origin, howMany: 1 }, function(err, result) {
                        expect(err).to.be.null;
                        expect(result).to.not.be.null;
                    });
                });
                break;

            case 'BlockIdentCheck':
                var ident = 'N415PW';
                it('looks up block ident for ' + ident, function() {
                    client.BlockIdentCheck(ident, function(err, result) {
                        expect(err).to.be.null;
                        expect(result).to.not.be.null;
                    });
                });
                break;

            case 'CountAirportOperations':
                var origin = 'KSFO';
                it('counts airport operations for ' + origin, function() {
                    client.CountAirportOperations(origin, function(err, result) {
                        expect(err).to.be.null;
                        expect(result).to.not.be.null;
                    });
                });
                break;

            case 'CountAllEnrouteAirlineOperations':
                it('counts all enroute airline operations', function() {
                    client.CountAllEnrouteAirlineOperations(function(err, result) {
                        expect(err).to.be.null;
                        expect(result).to.not.be.null;
                    });
                });
                break;

            case 'DecodeFlightRoute':
                var faFlightID = 'N415PW@1442008560';
                it('decodes flight route for ' + faFlightID, function() {
                    client.DecodeFlightRoute(faFlightID, function(err, result) {
                        expect(err).to.be.null;
                        expect(result).to.not.be.null;
                    });
                });
                break;

            case 'DecodeRoute':
                var origin = 'KSQL';
                var route = 'SJC V334 SAC SWR';
                var destination = 'KTRK';
                it('decodes route between ' + origin + ' and ' + destination, function() {
                    client.DecodeRoute({ 
                        origin: origin, 
                        route: route, 
                        destination: destination
                    }, function(err, result) {
                        expect(err).to.be.null;
                        expect(result).to.not.be.null;
                    });
                });
                break;

            case 'DeleteAlert':
                it('delete alert', function() {
                    client.DeleteAlert('1', function(err, result) {
                        expect(err).to.be.null;
                        expect(result).to.not.be.null;
                    });
                });
                break;

            case 'Departed':
                var origin = 'KSFO';
                it('looks up airline information', function() {
                    client.Departed({ 
                        airport: origin,
                        howMany: 1
                    }, function(err, result) {
                        expect(err).to.be.null;
                        expect(result).to.not.be.null;
                    });
                });
                break;

            case 'FleetArrived':
                it('looks up airline information', function() {
                    client.FleetArrived({ 
                        fleet: "URF", 
                        howMany: 1 
                    }, function(err, result) {
                        expect(err).to.be.null;
                        expect(result).to.not.be.null;
                    });
                });
                break;

            case 'FleetScheduled':
                var fleet = 'URF';
                it('looks up airline information', function() {
                    client.FleetScheduled({ 
                        fleet: fleet, 
                        howMany: 1 
                    }, function(err, result) {
                        expect(err).to.be.null;
                        expect(result).to.not.be.null;
                    });
                });
                break;

            case 'FlightInfo':
                client.FlightInfo({ 
                    ident: "N415PW", 
                    howMany: 1
                }, report);
                break;

            case 'FlightInfoEx':
                client.FlightInfoEx({ 
                    ident: "N415PW", 
                    howMany: 1
                }, report);
                break;

            case 'GetAlerts':
                client.GetAlerts(report);
                break;

            case 'GetFlightID':
                client.GetFlightID({ 
                    ident: 'N415PW', 
                    departureTime: '1442008560' 
                }, report);
                break;

            case 'GetHistoricalTrack':
                client.GetHistoricalTrack('N415PW@1442008560', report);
                break;

            case 'GetLastTrack':
                client.GetLastTrack('N415PW', report);
                break;

            case 'InboundFlightInfo':
                client.InboundFlightInfo('N415PW-1457118526-1-0', report);
                break;

            case 'InFlightInfo':
                client.InFlightInfo('N415PW', report);
                break;

            case 'LatLongsToDistance':
                client.LatLongsToDistance({ 
                    lat1: 37.3626667,
                    lon1: -121.9291111,
                    lat2: 33.9425003,
                    lon2: -118.4080736,
                }, report);
                break;

            case 'LatLongsToHeading':
                client.LatLongsToHeading({ 
                    lat1: 37.3626667,
                    lon1: -121.9291111,
                    lat2: 33.9425003,
                    lon2: -118.4080736,
                }, report);
                break;

            case 'MapFlight':
                client.MapFlight({
                    ident: 'N415PW',
                    mapHeight: 32,
                    mapWidth: 32,
                }, report);
                break;

            case 'MapFlightEx':
                client.MapFlightEx({
                    faFlightID: 'SKW2494@1442040480',
                    mapHeight: 32,
                    mapWidth: 32,
                    show_data_blocks: true,
                    show_airports: true,
                    airports_expand_view: true,
                }, report);
                break;

            case 'Metar':
                client.Metar('KSFO', report);
                break;

            case 'MetarEx':
                client.MetarEx({
                    airport: 'KSFO', 
                    howMany: 1,
                }, report);
                break;

            case 'NTaf':
                client.NTaf('KSFO', report);
                break;

            case 'RegisterAlertEndpoint':
                client.RegisterAlertEndpoint({
                    address: 'http://www.example.com', 
                    format_type: 'json/post',
                }, report);
                break;

            case 'RoutesBetweenAirports':
                client.RoutesBetweenAirports({
                    origin: 'KSFO', 
                    destination: 'KLAX',
                }, report);
                break;

            case 'RoutesBetweenAirportsEx':
                client.RoutesBetweenAirportsEx({
                    origin: 'KSFO', 
                    destination: 'KLAX',
                    howMany: 1,
                }, report);
                break;

            case 'Scheduled':
                client.Scheduled({
                    airport: 'KSFO', 
                    howMany: 1,
                }, report);
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
                }, report);
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
                    }, report);
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
                    }, report);
                }
                break;

            case 'SearchCount':
                client.SearchCount({
                    query: '-destination KLAX -prefix H',
                    howMany: 1,
                }, report);
                break;

            case 'SetAlert':
                // XXX:  need to create a SetAlert test
                break;

            case 'SetMaximumResultSize':
                client.SetMaximumResultSize(100, report);
                break;

            case 'Taf':
                client.Taf('KSFO', report);
                break;

            case 'TailOwner':
                client.TailOwner('N415PW', report);
                break;

            case 'ZipcodeInfo':
                client.ZipcodeInfo('95060', report);
                break;

            default:
                console.log("Unimplemented API test:", tests[i]);
                break;
        }
    });
}
