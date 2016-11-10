// Local developer configuration ...
var config = require('./config');
var expect = require("chai").expect;
var FlightAware = require('./flightaware');
var verbose = true;
var client = new FlightAware();

describe('FlightAware constructor', function() {
    it('creates a client object', function() {
        expect(client).to.not.be.null;
        expect(client.username).to.be.undefined;
        expect(client.apiKey).to.be.undefined;
    });
});

describe('setCredentials', function() {
    it('sets the FlightAware username and api key', function() {
        client.setCredentials(config.username, config.apiKey);
        expect(client.username).to.equal(config.username);
        expect(client.apiKey).to.equal(config.apiKey);
    });
});

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
    'SearchBirdseyeInFlight',
    'SearchBirdseyePositions',
    'SearchCount',
    'SetMaximumResultSize',
    'Taf',
    'TailOwner',
    'ZipcodeInfo',
];

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
                it('looks up airline flight schedules for the next 24 hours', function() {
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

                var now = Math.floor(Date.now()/1000);

                it('looks up airline flight schedules for the next hour', function() {
                    client.AirlineFlightSchedules({
                        startDate: now,
                        endDate: now + 1*60*60,
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
                it('looks up airline flight schedules for the past hour', function() {
                    client.AirlineFlightSchedules({
                        startDate: now - 1*60*60,
                        endDate: now,
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
                it('looks up airline information for route ' + origin + ' to ' + destination + ' (default report)', function() {
                    client.AirlineInsight({ 
                        origin: origin,
                        destination: destination,
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
                it('looks up airline information for route ' + origin + ' to ' + destination + ' (alternate route popularity)', function() {
                    client.AirlineInsight({ 
                        origin: origin,
                        destination: destination,
                        reportType: 1,
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
                it('deletes an alert', function() {
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
                var ident = 'N415PW';
                it('looks up flight information for ' + ident, function() {
                    client.FlightInfo({ 
                        ident: ident,
                        howMany: 1
                    }, function(err, result) {
                        expect(err).to.be.null;
                        expect(result).to.not.be.null;
                    });
                });
                break;

            case 'FlightInfoEx':
                var ident = 'N415PW';
                it('looks up flight information for ' + ident, function() {
                    client.FlightInfoEx({ 
                        ident: ident, 
                        howMany: 1
                    }, function(err, result) {
                        expect(err).to.be.null;
                        expect(result).to.not.be.null;
                    });
                });
                break;

            case 'GetAlerts':
                it('setup offline alerts', function() {
                    client.GetAlerts(function(err, result) {
                        expect(err).to.be.null;
                        expect(result).to.not.be.null;
                    });
                });
                break;

            case 'GetFlightID':
                var ident = 'N415PW';
                var departure = '1442008560' ;
                it('looks up a flight for ' + ident, function() {
                    client.GetFlightID({ 
                        ident: 'N415PW', 
                        departureTime: '1442008560' 
                    }, function(err, result) {
                        expect(err).to.be.null;
                        expect(result).to.not.be.null;
                    });
                });
                break;

            case 'GetHistoricalTrack':
                var faFlightID = 'N415PW@1442008560' ;
                it('looks up a historical track for ' + faFlightID, function() {
                    client.GetHistoricalTrack(faFlightID, function(err, result) {
                        expect(err).to.be.null;
                        expect(result).to.not.be.null;
                    });
                });
                break;

            case 'GetLastTrack':
                var ident = 'N415PW';
                it('looks up last track for ' + ident, function() {
                    client.GetLastTrack(ident, function(err, result) {
                        expect(err).to.be.null;
                        expect(result).to.not.be.null;
                    });
                });
                break;

            case 'InboundFlightInfo':
                var faFlightID = 'N415PW-1457118526-1-0';
                it('looks up inbound flight info for ' + faFlightID, function() {
                    client.InboundFlightInfo(faFlightID, function(err, result) {
                        expect(err).to.be.null;
                        expect(result).to.not.be.null;
                    });
                });
                break;

            case 'InFlightInfo':
                var ident = 'N415PW';
                it('looks up in flight information for ' + ident, function() {
                    client.InFlightInfo(ident, function(err, result) {
                        expect(err).to.be.null;
                        expect(result).to.not.be.null;
                    });
                });
                break;

            case 'LatLongsToDistance':
                var lat1 = 37.3626667;
                var lon1 = -121.9291111;
                var lat2 = 33.9425003;
                var lon2 = -118.4080736;
                it('computes distance between lat/long points', function() {
                    client.LatLongsToDistance({ 
                        lat1: lat1,
                        lon1: lon1,
                        lat2: lat2,
                        lon2: lon2,
                    }, function(err, result) {
                        expect(err).to.be.null;
                        expect(result).to.not.be.null;
                    });
                });
                break;

            case 'LatLongsToHeading':
                var lat1 = 37.3626667;
                var lon1 = -121.9291111;
                var lat2 = 33.9425003;
                var lon2 = -118.4080736;
                it('computes heading between lat/long points', function() {
                    client.LatLongsToHeading({ 
                        lat1: lat1,
                        lon1: lon1,
                        lat2: lat2,
                        lon2: lon2,
                    }, function(err, result) {
                        expect(err).to.be.null;
                        expect(result).to.not.be.null;
                    });
                });
                break;

            case 'MapFlight':
                var ident = 'N415PW';
                var mapHeight = 32;
                var mapWidth = 32;
                it('creates flight image for ' + ident, function() {
                    client.MapFlight({
                        ident: ident,
                        mapHeight: mapHeight,
                        mapWidth: mapWidth,
                    }, function(err, result) {
                        expect(err).to.be.null;
                        expect(result).to.not.be.null;
                    });
                });
                break;

            case 'MapFlightEx':
                var faFlightID = 'SKW2494@1442040480';
                var mapHeight = 32;
                var mapWidth = 32;
                it('creates detailed flight image for ' + faFlightID, function() {
                    client.MapFlightEx({
                        faFlightID: faFlightID,
                        mapHeight: mapHeight,
                        mapWidth: mapWidth,
                        show_data_blocks: true,
                        show_airports: true,
                        airports_expand_view: true,
                    }, function(err, result) {
                        expect(err).to.be.null;
                        expect(result).to.not.be.null;
                    });
                });
                break;

            case 'Metar':
                var airport = 'KSFO';
                it('looks up weather for airport ' + airport, function() {
                    client.Metar(airport, function(err, result) {
                        expect(err).to.be.null;
                        expect(result).to.not.be.null;
                    });
                });
                break;

            case 'MetarEx':
                var airport = 'KSFO';
                it('looks up detailed weather for airport ' + airport, function() {
                    client.MetarEx({
                        airport: airport, 
                        howMany: 1,
                    }, function(err, result) {
                        expect(err).to.be.null;
                        expect(result).to.not.be.null;
                    });
                });
                break;

            case 'NTaf':
                var airport = 'KSFO';
                it('looks up in terminal area forecast for ' + airport, function() {
                    client.NTaf(airport, function(err, result) {
                        expect(err).to.be.null;
                        expect(result).to.not.be.null;
                    });
                });
                break;

            case 'RegisterAlertEndpoint':
                var address = 'http://www.example.com';
                it('registers alert endpoint for ' + address, function() {
                    client.RegisterAlertEndpoint({
                        address: address, 
                        format_type: 'json/post',
                    }, function(err, result) {
                        expect(err).to.be.null;
                        expect(result).to.not.be.null;
                    });
                });
                break;

            case 'RoutesBetweenAirports':
                var origin = 'KSFO';
                var destination = 'KLAX';
                it('looks up routes between airports ' + origin + ' and ' + destination, function() {
                    client.RoutesBetweenAirports({
                        origin: origin, 
                        destination: destination,
                    }, function(err, result) {
                        expect(err).to.be.null;
                        expect(result).to.not.be.null;
                    });
                });
                break;

            case 'RoutesBetweenAirportsEx':
                var origin = 'KSFO';
                var destination = 'KLAX';
                it('looks up detailed routes between airports ' + origin + ' and ' + destination, function() {
                    client.RoutesBetweenAirportsEx({
                        origin: origin, 
                        destination: destination,
                        howMany: 1,
                    }, function(err, result) {
                        expect(err).to.be.null;
                        expect(result).to.not.be.null;
                    });
                });
                break;

            case 'Scheduled':
                var airport = 'KSFO';
                it('looks up scheduled flights for ' + airport, function() {
                    client.Scheduled({
                        airport: airport, 
                        howMany: 1,
                    }, function(err, result) {
                        expect(err).to.be.null;
                        expect(result).to.not.be.null;
                    });
                });
                break;

            case 'Search':
                var searchParameters = [
                    { "type" : "B77*" },
                    { "belowAltitude" : 100, "aboveGroundspeed" : 200 },
                    { "destination" : "KLAX", "prefix" : "H" },
                    { "idents" : "UAL*", "type" : "B73*" },
                ];

                for(var i in searchParameters) {
                    var parameters = searchParameters[i];

                    it('looks up flights by parameters ' + JSON.stringify(parameters), function() {
                        client.Search({
                            parameters: parameters,
                            howMany: 1,
                        }, function(err, result) {
                            expect(err).to.be.null;
                            expect(result).to.not.be.null;
                        });
                    });
                }

                var query = '-destination KLAX -prefix H';
                it('looks up flights by query ' + query, function() {
                    client.Search({
                        query: '-destination KLAX -prefix H',
                        howMany: 1,
                    }, function(err, result) {
                        expect(err).to.be.null;
                        expect(result).to.not.be.null;
                    });
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
                    it('looks up in flight information by query ' + query, function() {
                        client.SearchBirdseyeInFlight({
                            query: query,
                            howMany: 1,
                        }, function(err, result) {
                            expect(err).to.be.null;
                            expect(result).to.not.be.null;
                        });
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
                    it('looks up in flight information by position query ' + query, function() {
                        client.SearchBirdseyePositions({
                            query: query,
                            uniqueFlights: true,
                            howMany: 1,
                        }, function(err, result) {
                            expect(err).to.be.null;
                            expect(result).to.not.be.null;
                        });
                    });
                }
                break;

            case 'SearchCount':
                var query = '-destination KLAX -prefix H';
                it('looks up and counts flights by query ' + query, function() {
                    client.SearchCount({
                        query: query,
                        howMany: 1,
                    }, function(err, result) {
                        expect(err).to.be.null;
                        expect(result).to.not.be.null;
                    });
                });
                break;

            case 'SetAlert':
                // XXX:  need to create a SetAlert test
                break;

            case 'SetMaximumResultSize':
                var maxResultSize = 100;
                it('sets maximum result size to ' + maxResultSize, function() {
                    client.SetMaximumResultSize(maxResultSize, function(err, result) {
                        expect(err).to.be.null;
                        expect(result).to.not.be.null;
                    });
                });
                break;

            case 'Taf':
                var airport = 'KSFO';
                it('looks up terminal area forecast for ' + airport, function() {
                    client.Taf(airport, function(err, result) {
                        expect(err).to.be.null;
                        expect(result).to.not.be.null;
                    });
                });
                break;

            case 'TailOwner':
                var ident = 'N415PW';
                it('looks up owner by tail number ' + ident, function() {
                    client.TailOwner(ident, function(err, result) {
                        expect(err).to.be.null;
                        expect(result).to.not.be.null;
                    });
                });
                break;

            case 'ZipcodeInfo':
                var zipcode = '95060';
                it('looks up zipcode information for ' + zipcode, function() {
                    client.ZipcodeInfo(zipcode, function(err, result) {
                        expect(err).to.be.null;
                        expect(result).to.not.be.null;
                    });
                });
                break;

            default:
                console.log("Unimplemented API test:", tests[i]);
                break;
        }
    });
}
