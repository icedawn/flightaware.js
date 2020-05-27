/* eslint no-console: ["error", { allow: ["log", "warn", "error"] }] */

// Local developer configuration ...
var config = require('./config');
var expect = require("chai").expect;
var FlightAware = require('./flightaware');
var verbose = true;
var client = new FlightAware();

describe('FlightAware constructor', function() {
    it('creates a client object', (done) => {
        expect(client).to.not.be.null;
        expect(client.username).to.be.undefined;
        expect(client.apiKey).to.be.undefined;
        done();
    });
});

describe('setCredentials', function() {
    it('sets the FlightAware username and api key', (done) => {
        client.setCredentials(config.username, config.apiKey);
        expect(client.username).to.equal(config.username);
        expect(client.apiKey).to.equal(config.apiKey);
        done();
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
]

const _t = {
    'AircraftType': (aircraftType) => {
        it('looks up ' + aircraftType + ' aircraft', (done) => {
            client.AircraftType(aircraftType, (err, result) => {
                if(verbose) console.log(`result: ${JSON.stringify(result)}`)
                expect(err).to.be.null
                expect(result).to.not.be.null
                expect(result).to.not.be.undefined
                expect(result).to.contain.all.keys(['manufacturer', 'type', 'description'])
                done()
            })
        })
    },
    'AirlineFlightInfo': (faFlightID) => {
        it('looks up flight ID '+ faFlightID, (done) => {
            client.AirlineFlightInfo(faFlightID, (err, result) => {
                if(verbose) console.log(`result: ${JSON.stringify(result)}`)
                expect(err).to.be.null
                expect(result).to.not.be.null
                if(result) expect(result).to.contain.all.keys(['ident'])
                done()
            })
        })
    },
    'AirlineFlightSchedules': (params) => {
        it(`looks up airline flight schedules: ${JSON.stringify(params)}`, (done) => {
            client.AirlineFlightSchedules(params, (err, result) => {
                if(verbose) console.log(`result: ${JSON.stringify(result)}`)
                expect(err).to.be.null
                expect(result).to.not.be.null
                done()
            })
        })
    },
    'AirlineInfo': (airlineCode) => {
        it(`looks up airline information for ${airlineCode}`, (done) => {
            client.AirlineInfo(airlineCode, (err, result) => {
                if(verbose) console.log(`result: ${JSON.stringify(result)}`)
                expect(err).to.be.null
                done()
            })
        })
    },
    'AirlineInsight': (params) => {
        it(`looks up airline information for route ${JSON.stringify(params)}`, (done) => {
            client.AirlineInsight(params, (err, result) => {
                if(verbose) console.log(`result: ${JSON.stringify(result)}`)
                expect(err).to.be.null
                expect(result).to.not.be.null
                done()
            })
        })
    },
    'AirportInfo': (origin) => {
        it(`looks up airport information for ${origin}`, (done) => {
            client.AirportInfo(origin, (err, result) => {
                if(verbose) console.log(`result: ${JSON.stringify(result)}`)
                expect(err).to.be.null
                expect(result).to.not.be.null
                done()
            })
        })
    },
    'AllAirlines': () => {
        it('looks up all airline information', (done) => {
            client.AllAirlines((err, result) => {
                if(verbose) console.log(`result: ${JSON.stringify(result)}`)
                expect(err).to.be.null
                expect(result).to.not.be.null
                done()
            })
        })
    },
    'AllAirports': () => {
        it('looks up all airport information', (done) => {
            client.AllAirports((err, result) => {
                if(verbose) console.log(`result: ${JSON.stringify(result)}`)
                expect(err).to.be.null
                expect(result).to.not.be.null
                done()
            })
        })
    },
    'Arrived': (params) => {
        it(`looks up arrival information for ${JSON.stringify(params)}`, (done) => {
            client.Arrived(params, (err, result) => {
                if(verbose) console.log(`result: ${JSON.stringify(result)}`)
                expect(err).to.be.null
                expect(result).to.not.be.null
                done()
            })
        })
    },
    'BlockIdentCheck': (ident) => {
        it(`looks up block ident for ${JSON.stringify(ident)}`, (done) => {
            client.BlockIdentCheck(ident, (err, result) => {
                if(verbose) console.log(`result: ${JSON.stringify(result)}`)
                expect(err).to.be.null
                expect(result).to.not.be.null
                done()
            })
        })
    },
    'CountAirportOperations': (origin) => {
        it(`counts airport operations for ${origin}`, (done) => {
            client.CountAirportOperations(origin, (err, result) => {
                if(verbose) console.log(`result: ${JSON.stringify(result)}`)
                expect(err).to.be.null
                expect(result).to.not.be.null
                done()
            })
        })
    },
    'CountAllEnrouteAirlineOperations': () => {
        it('counts all enroute airline operations', (done) => {
            client.CountAllEnrouteAirlineOperations((err, result) => {
                if(verbose) console.log(`result: ${JSON.stringify(result)}`)
                expect(err).to.be.null
                expect(result).to.not.be.null
                done()
            })
        })
    },
    'DecodeFlightRoute': (faFlightID) => {
        it(`decodes flight route for ${JSON.stringify(faFlightID)}`, (done) => {
            client.DecodeFlightRoute(faFlightID, (err, result) => {
                if(verbose) console.log(`result: ${JSON.stringify(result)}`)
                expect(err).to.be.null
                expect(result).to.not.be.null
                done()
            })
        })
    },
    'DecodeRoute': (params) => {
        it(`decodes route between ${JSON.stringify(params)}`, (done) => {
            client.DecodeRoute(params, (err, result) => {
                if(verbose) console.log(`result: ${JSON.stringify(result)}`)
                expect(err).to.be.null
                expect(result).to.not.be.null
                done()
            })
        })
    },
    'DeleteAlert': (alertId) => {
        it(`deletes an alert: ${JSON.stringify(alertId)}`, (done) => {
            client.DeleteAlert(alertId, (err, result) => {
                if(verbose) console.log(`result: ${JSON.stringify(result)}`)
                expect(err).to.be.null
                done()
            })
        })
    },
    'Departed': (params) => {
        it(`looks up flights departing from an airport ${JSON.stringify(params)}`, (done) => {
            client.Departed(params, (err, result) => {
                if(verbose) console.log(`result: ${JSON.stringify(result)}`)
                expect(err).to.be.null
                expect(result).to.not.be.null
                done()
            })
        })
    },
    'FleetArrived': (params) => {
        it(`looks up an airline's flights recently arrived ${JSON.stringify(params)}`, (done) => {
            client.FleetArrived(params, (err, result) => {
                if(verbose) console.log(`result: ${JSON.stringify(result)}`)
                expect(err).to.be.null
                expect(result).to.not.be.null
                done()
            })
        })
    },
    'FleetScheduled': (params) => {
        it(`looks up an airline's flights scheduled to arrive ${JSON.stringify(params)}`, (done) => {
            client.FleetScheduled(params, (err, result) => {
                if(verbose) console.log(`result: ${JSON.stringify(result)}`)
                expect(err).to.be.null
                expect(result).to.not.be.null
                done()
            })
        })
    },
    'FlightInfo': (params) => {
        it(`looks up flight information for ${JSON.stringify(params)}`, (done) => {
            client.FlightInfo(params, (err, result) => {
                if(verbose) console.log(`result: ${JSON.stringify(result)}`)
                expect(err).to.be.null
                expect(result).to.not.be.null
                done()
            })
        })
    },
    'FlightInfoEx': (params) => {
        it(`looks up extended flight information for ${JSON.stringify(params)}`, (done) => {
            client.FlightInfoEx(params, (err, result) => {
                if(verbose) console.log(`result: ${JSON.stringify(result)}`)
                expect(err).to.be.null
                expect(result).to.not.be.null
                done()
            })
        })
    },
    'GetAlerts': () => {
        it('get alerts registered to the current user account', (done) => {
            client.GetAlerts((err, result) => {
                if(verbose) console.log(`result: ${JSON.stringify(result)}`)
                expect(err).to.be.null
                expect(result).to.not.be.null
                done()
            })
        })
    },
    'GetFlightID': (params) => {
        it(`looks up a flight for ${JSON.stringify(params)}`, (done) => {
            client.GetFlightID(params, (err, result) => {
                if(verbose) console.log(`result: ${JSON.stringify(result)}`)
                expect(err).to.be.null
                expect(result).to.not.be.null
                done()
            })
        })
    },
    'GetHistoricalTrack': (faFlightID) => {
        it(`looks up a historical track for ${JSON.stringify(faFlightID)}`, (done) => {
            client.GetHistoricalTrack(faFlightID, (err, result) => {
                if(verbose) console.log(`result: ${JSON.stringify(result)}`)
                expect(err).to.be.null
                expect(result).to.not.be.null
                done()
            })
        })
    },
    'GetLastTrack': (ident) => {
        it(`looks up last track for ${JSON.stringify(ident)}`, (done) => {
            client.GetLastTrack(ident, (err, result) => {
                if(verbose) console.log(`result: ${JSON.stringify(result)}`)
                expect(err).to.be.null
                expect(result).to.not.be.null
                done()
            })
        })
    },
    'InboundFlightInfo': (faFlightID) => {
        it(`looks up inbound flight info for ${JSON.stringify(faFlightID)}`, (done) => {
            client.InboundFlightInfo(faFlightID, (err, result) => {
                if(verbose) console.log(`result: ${JSON.stringify(result)}`)
                expect(err).to.be.null
                expect(result).to.not.be.null
                done()
            })
        })
    },
    'InFlightInfo': (ident) => {
        it(`looks up in flight information for ${JSON.stringify(ident)}`, (done) => {
            client.InFlightInfo(ident, (err, result) => {
                if(verbose) console.log(`result: ${JSON.stringify(result)}`)
                expect(err).to.be.null
                expect(result).to.not.be.null
                done()
            })
        })
    },
    'LatLongsToDistance': (params) => {
        it(`computes distance between lat/long points: ${JSON.stringify(params)}`, (done) => {
            client.LatLongsToDistance(params, (err, result) => {
                if(verbose) console.log(`result: ${JSON.stringify(result)}`)
                expect(err).to.be.null
                expect(result).to.not.be.null
                done()
            })
        })
    },
    'LatLongsToHeading': (params) => {
        it(`computes heading between lat/long points: ${JSON.stringify(params)}`, (done) => {
            client.LatLongsToHeading(params, (err, result) => {
                if(verbose) console.log(`result: ${JSON.stringify(result)}`)
                expect(err).to.be.null
                expect(result).to.not.be.null
                done()
            })
        })
    },
    'MapFlight': (params) => {
        it(`creates flight image for: ${JSON.stringify(params)}`, (done) => {
            client.MapFlight(params, (err, result) => {
                if(verbose) console.log(`result: ${JSON.stringify(result)}`)
                expect(err).to.be.null
                expect(result).to.not.be.null
                done()
            })
        })
    },
    'MapFlightEx': (params) => {
        it(`creates detailed flight image for: ${JSON.stringify(params)}`, (done) => {
            client.MapFlightEx(params, (err, result) => {
                if(verbose) console.log(`result: ${JSON.stringify(result)}`)
                expect(err).to.be.null
                expect(result).to.not.be.null
                done()
            })
        })
    },
    'Metar': (airport) => {
        it(`looks up weather for airport ${JSON.stringify(airport)}`, (done) => {
            client.Metar(airport, (err, result) => {
                if(verbose) console.log(`result: ${JSON.stringify(result)}`)
                expect(err).to.be.null
                expect(result).to.not.be.null
                done()
            })
        })
    },
    'MetarEx': (params) => {
        it(`looks up detailed weather for airport: ${JSON.stringify(params)}`, (done) => {
            client.MetarEx(params, (err, result) => {
                if(verbose) console.log(`result: ${JSON.stringify(result)}`)
                expect(err).to.be.null
                expect(result).to.not.be.null
                done()
            })
        })
    },
    'NTaf': (airport) => {
        it(`looks up in terminal area forecast for airport: ${JSON.stringify(airport)}`, (done) => {
            client.NTaf(airport, (err, result) => {
                if(verbose) console.log(`result: ${JSON.stringify(result)}`)
                expect(err).to.be.null
                expect(result).to.not.be.null
                done()
            })
        })
    },
    'RegisterAlertEndpoint': (params) => {
        it(`registers alert endpoint for: ${JSON.stringify(params)}`, (done) => {
            client.RegisterAlertEndpoint(params, (err, result) => {
                if(verbose) console.log(`result: ${JSON.stringify(result)}`)
                expect(err).to.be.null
                expect(result).to.not.be.null
                done()
            })
        })
    },
    'RoutesBetweenAirports': (params) => {
        it(`looks up routes between airports: ${JSON.stringify(params)}`, (done) => {
            client.RoutesBetweenAirports(params, (err, result) => {
                if(verbose) console.log(`result: ${JSON.stringify(result)}`)
                expect(err).to.be.null
                expect(result).to.not.be.null
                done()
            })
        })
    },
    'RoutesBetweenAirportsEx': (params) => {
        it(`looks up detailed routes between airports: ${JSON.stringify(params)}`, (done) => {
            client.RoutesBetweenAirportsEx(params, (err, result) => {
                if(verbose) console.log(`result: ${JSON.stringify(result)}`)
                expect(err).to.be.null
                expect(result).to.not.be.null
                done()
            })
        })
    },
    'Scheduled': (params) => {
        it(`looks up scheduled flights for airport: ${JSON.stringify(params)}`, (done) => {
            client.Scheduled(params, (err, result) => {
                if(verbose) console.log(`result: ${JSON.stringify(result)}`)
                expect(err).to.be.null
                expect(result).to.not.be.null
                done()
            })
        })
    },
    'Search': (params) => {
        it(`looks up flights by parameters: ${JSON.stringify(params)}`, (done) => {
            client.Search(params,(err, result) => {
                if(verbose) console.log(`result: ${JSON.stringify(result)}`)
                expect(err).to.be.null
                expect(result).to.not.be.null
            done()
            })
        })
    },
    'SearchBirdseyeInFlight': (params) => {
        it(`looks up in flight information by query: ${JSON.stringify(params)}`, (done) => {
            client.SearchBirdseyeInFlight(params, (err, result) => {
                if(verbose) console.log(`result: ${JSON.stringify(result)}`)
                expect(err).to.be.null
                expect(result).to.not.be.null
                done()
            })
        })
    },
    'SearchBirdseyePositions': (params) => {
        it(`looks up in flight information by position query: ${JSON.stringify(params)}`, (done) => {
            client.SearchBirdseyePositions(params, (err, result) => {
                if(verbose) console.log(`result: ${JSON.stringify(result)}`)
                expect(err).to.be.null
                expect(result).to.not.be.null
                done()
            })
        })
    },
    'SearchCount': (params) => {
        it(`looks up and counts flights by query: ${JSON.stringify(params)}`, (done) => {
            client.SearchCount(params, (err, result) => {
                if(verbose) console.log(`result: ${JSON.stringify(result)}`)
                expect(err).to.be.null
                expect(result).to.not.be.null
                done()
            })
        })
    },
    'SetMaximumResultSize': (maxResultSize) => {
        it(`sets maximum result size to ${JSON.stringify(maxResultSize)}`, (done) => {
            client.SetMaximumResultSize(maxResultSize, (err, result) => {
                if(verbose) console.log(`result: ${JSON.stringify(result)}`)
                expect(err).to.be.null
                expect(result).to.not.be.null
                done()
            })
        })
    },
    'Taf': (airport) => {
        it(`looks up terminal area forecast for: ${JSON.stringify(airport)}`, (done) => {
            client.Taf(airport, (err, result) => {
                if(verbose) console.log(`result: ${JSON.stringify(result)}`)
                expect(err).to.be.null
                expect(result).to.not.be.null
                done()
            })
        })
    },
    'TailOwner': (ident) => {
        it(`looks up owner by tail number: ${JSON.stringify(ident)}`, (done) => {
            client.TailOwner(ident, (err, result) => {
                if(verbose) console.log(`result: ${JSON.stringify(result)}`)
                expect(err).to.be.null
                expect(result).to.not.be.null
                done()
            })
        })
    },
    'ZipcodeInfo': (zipcode) => {
        it(`looks up zipcode information for: ${JSON.stringify(zipcode)}`, (done) => {
            client.ZipcodeInfo(zipcode, (err, result) => {
                if(verbose) console.log(`result: ${JSON.stringify(result)}`)
                expect(err).to.be.null
                expect(result).to.not.be.null
                done()
            })
        })
    }
}

for(const test of tests) {
    
    describe(test, function() {
        switch(test) {
            case 'AircraftType':
                _t[test]('GALX')
                _t[test]('BOGUS AIRCRAFT TYPE')
                break;

            case 'AirlineFlightInfo':
                _t[test]('N415PW@1442008560')
                _t[test]('BOGUS FLIGHT ID')
                break;

            case 'AirlineFlightSchedules':
                var now = Math.floor(Date.now()/1000);
                _t[test]({ origin: 'KSJC', howMany: 1 })
                _t[test]({ origin: 'KSJC', startDate: now, EndDate: now + 1*60*60, howMany: 1 })
                _t[test]({ origin: 'KSJC', startDate: now-1*60*60, EndDate: now, howMany: 1 })
                _t[test]({ howMany: 1 })
                _t[test]({})
                _t[test]({ origin: 'BOGUS AIRPORT' })
                break;

            case 'AirlineInfo':
                _t[test]('UAL')
                _t[test]('BOGUS AIRLINE')
                break;

            // XXX:  this API does not appear to be working ...
            case 'AirlineInsight':
                _t[test]({ origin: 'KSJC', destination: 'KLAX' })
                _t[test]({ origin: 'SJC', destination: 'LAX', reportType: 1 })
                _t[test]({ origin: 'SJC', destination: 'LAX', reportType: 2 })
                _t[test]({ origin: 'SJC', destination: 'LAX', reportType: 3 })
                _t[test]({ origin: 'SJC', destination: 'LAX', reportType: 4 })
                _t[test]({ origin: 'BOGUS AIRPORT', destination: 'BOGUS AIRPORT' })
                break;

            case 'AirportInfo':
                _t[test]('SFO')
                _t[test]('BOGUS AIRPORT')
                break;

            case 'AllAirlines':
                _t[test]()
                break;

            case 'AllAirports':
                _t[test]()
                break;

            case 'Arrived':
                _t[test]({ airport: 'KSFO', howMany: 1 })
                _t[test]({ airport: 'KSFO' })
                _t[test]({ airport: 'BOGUS AIRPORT' })
                _t[test]({})
                break;

            case 'BlockIdentCheck':
                _t[test]('N415PW')
                _t[test]('BOGUS AIRCRAFT IDENT')
                _t[test]('')
                break;

            case 'CountAirportOperations':
                _t[test]('KSFO')
                _t[test]('BOGUS AIRPORT')
                _t[test]('')
                break;

            case 'CountAllEnrouteAirlineOperations':
                _t[test]()
                break;

            case 'DecodeFlightRoute':
                _t[test]('N415PW@1442008560')
                _t[test]('BOGUS FLIGHT ID')
                break;

            case 'DecodeRoute':
                _t[test]({ origin: 'KSQL', route: 'SJC V334 SAC SWR', destination: 'KTRK' })
                break;

            case 'DeleteAlert':
                _t[test]('1')
                _t[test](null)
                break;

            case 'Departed':
                _t[test]({ airport: 'KSFO', howMany: 1 })
                _t[test]({ airport: 'BOGUS AIRPORT', howMany: 1 })
                _t[test]({})
                break;

            case 'FleetArrived':
                _t[test]({ fleet: 'UAL', howMany: 1 })
                _t[test]({ fleet: 'BOGUS FLEET', howMany: 1 })
                _t[test]({})
                break;

            case 'FleetScheduled':
                _t[test]({ fleet: 'UAL', howMany: 1 })
                _t[test]({ fleet: 'BOGUS FLEET', howMany: 1 })
                _t[test]({})
                break;

            case 'FlightInfo':
                _t[test]({ ident: 'N415PW', howMany: 1 })
                _t[test]({ ident: 'BOGUS AIRCRAFT IDENT', howMany: 1 })
                _t[test]({})
                break;

            case 'FlightInfoEx':
                _t[test]({ ident: 'N415PW', howMany: 1 })
                _t[test]({ ident: 'BOGUS AIRCRAFT IDENT', howMany: 1 })
                _t[test]({})
                break;

            case 'GetAlerts':
                _t[test]()
                break;

            case 'GetFlightID':
                _t[test]({ ident: 'N415PW', departureTime: '1442008560' })
                _t[test]({ ident: 'BOGUS AIRCRAFT IDENT', departureTime: '1442008560' })
                _t[test]({})
                break;

            case 'GetHistoricalTrack':
                _t[test]('N415PW@1442008560')
                _t[test]('BOGUS TRACK ID')
                _t[test]()
                break;

            // XXX:  this API does not appear to be working ...
            case 'GetLastTrack':
                _t[test]('N415PW')
                _t[test]('BOGUS AIRCRAFT ID')
                _t[test]()
                break;

            case 'InboundFlightInfo':
                _t[test]('N415PW-1457118526-1-0')
                break;

            case 'InFlightInfo':
                _t[test]('N415PW')
                break;

            case 'LatLongsToDistance':
                _t[test]({ lat1: 37.3626667, lon1: -121.9291111, lat2: 33.9425003, lon2: -118.4080736 })
                break;

            case 'LatLongsToHeading':
                _t[test]({ lat1: 37.3626667, lon1: -121.9291111, lat2: 33.9425003, lon2: -118.4080736 })
                break;

            case 'MapFlight':
                _t[test]({ ident: 'N415PW', mapHeight: 32, mapWidth: 32 })
                break;

            case 'MapFlightEx':
                _t[test]({ faFlightID: 'SKW2494@1442040480', mapHeight: 32, mapWidth: 32, show_data_blocks: true, show_airports: true, airports_expand_view: true })
                break;

            case 'Metar':
                _t[test]('KSFO')
                _t[test]('BOGUS AIRPORT ID')
                _t[test]()
                break;

            case 'MetarEx':
                _t[test]({ airport: 'KSFO', howMany: 1 })
                _t[test]({ airport: 'BOGUS AIRPORT ID', howMany: 1 })
                _t[test]({})
                break;

            case 'NTaf':
                _t[test]('KSFO')
                _t[test]('BOGUS AIRPORT ID')
                _t[test]()
                break;

            case 'RegisterAlertEndpoint':
                _t[test]({ address: 'http://www.example.com', format_type: 'json/post' })
                break;

            case 'RoutesBetweenAirports':
                _t[test]({ origin: 'KSFO', destination: 'KLAX' })
                break;

            case 'RoutesBetweenAirportsEx':
                _t[test]({ origin: 'KSFO', destination: 'KLAX', howMany: 1 })
                break;

            // XXX:  this API does not appear to be working ...
            case 'Scheduled':
                _t[test]({ airport: 'KSFO', howMany: 1 })
                break;

            case 'Search':
                _t[test]({ parameters: { type: "B77*" }, howMany: 1 })
                _t[test]({ parameters: { belowAltitude: 100, "aboveGroundspeed" : 200 }, howMany: 1 })
                _t[test]({ parameters: { destination: "KLAX", "prefix" : "H" }, howMany: 1 })
                _t[test]({ parameters: { idents: "UAL*", "type" : "B77*" }, howMany: 1 })
                _t[test]({ query: '-destination KLAX -prefix H', howMany: 1 })
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

                for(const q of inFlightQueries) {
                    describe(`SearchBirdseyeInFlight: ${q[1]}`, (query=q[0]) => _t[test]({ query: query, howMany: 1 }))
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

                for(const q of positionQueries) {
                    describe(`SearchBirdseyePositions: ${q[1]}`, (query=q[0]) => _t[test]({ query: query, uniqueFlights: true, howMany: 1 }))
                }
                break;

            case 'SearchCount':
                _t[test]({ query: '-destination KLAX -prefix H', howMany: 1 })
                break;

            case 'SetAlert':
                // XXX:  need to create a SetAlert test
                break;

            case 'SetMaximumResultSize':
                _t[test](100)
                break;

            case 'Taf':
                _t[test]('KSFO')
                _t[test]('BOGUS AIRPORT ID')
                _t[test]()
                break;

            case 'TailOwner':
                _t[test]('N415PW')
                _t[test]('BOGUS AIRCRAFT ID')
                _t[test]()
                break;

            case 'ZipcodeInfo':
                _t[test]('95060')
                _t[test]('BOGUS ZIPCODE')
                _t[test]()
                break;

            default:
                console.log("Unimplemented API test:", test);
                break;
        }
    });
}
