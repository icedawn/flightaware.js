/* eslint no-console: ["error", { allow: ["log", "warn", "error"] }] */
const config = require('./config')
const expect = require("chai").expect
const FlightAware = require('./flightaware')

var client = new FlightAware()
client.debug = true

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

let defaultResultCheck = (result,keys) => {
    expect(result).to.not.be.null
    expect(result).to.not.be.undefined
    if(keys) {
        expect(result).to.be.an('object')
        expect(result).to.contain.all.keys(keys)
    }
}

let runTest = (title, api, params, check, noParams=false) => {

    // Run test with callback ...
    it(title, (done) => {
        if(noParams) {
            client[api]((err, result) => {
                if(err) { done(err) } else { check(result, done) }
            })
        }
        else {
            client[api](params, (err, result) => {
                if(err) { done(err) } else { check(result, done) }
            })
        }
    })

    // Run test with promise ...
    it(`[PROMISE] ${title}`, (done) => {
        client[api](params)
            .then((result) => { check(result, done) }).catch((err) => { done(err) })
    })
}

const _t = {
    'AircraftType': (params) => {
        let api = 'AircraftType'
        let title = `looks up aircraft ${JSON.stringify(params)}`
        let check = (result, done) => {
            defaultResultCheck(result, ['manufacturer', 'type', 'description'])
            done()
        }
        runTest(title, api, params, check)
    },
    'AirlineFlightInfo': (params) => {
        let api = 'AirlineFlightInfo'
        let title = `looks up flight ID ${JSON.stringify(params)}`
        let check = (result, done) => {
            defaultResultCheck(result, ['ident'])
            done()
        }
        runTest(title, api, params, check)
    },
    'AirlineFlightSchedules': (params) => {
        let api = 'AirlineFlightSchedules'
        let title = `looks up airline flight schedules: ${JSON.stringify(params)}`
        let check = (result, done) => {
            defaultResultCheck(result, ['next_offset', 'data'])
            expect(result.data).to.be.an('array')
            done()
        }
        runTest(title, api, params, check)
    },
    'AirlineInfo': (params) => {
        let api = 'AirlineInfo'
        let title = `looks up airline information for ${params}`
        let check = (result, done) => {
            defaultResultCheck(result, ['name', 'shortname', 'callsign','location','country','url', 'phone'])
            done()
        }
        runTest(title, api, params, check)
    },
    'AirportInfo': (params) => {
        let api = 'AirportInfo'
        let title = `looks up airport information for ${params}`
        let check = (result, done) => {
            defaultResultCheck(result, ['name', 'location', 'longitude', 'latitude', 'timezone'])
            done()
        }
        runTest(title, api, params, check)
    },
    'AllAirlines': () => {
        let api = 'AllAirlines'
        let title = `looks up all airline information`
        let check = (result, done) => {
            defaultResultCheck(result, ['data'])
            expect(result.data).to.be.an('array')
            done()
        }
        runTest(title, api, undefined, check, noParams=true)
    },
    'AllAirports': () => {
        let api = 'AllAirports'
        let title = `looks up all airport information`
        let check = (result, done) => {
            defaultResultCheck(result, ['data'])
            expect(result.data).to.be.an('array')
            done()
        }
        runTest(title, api, undefined, check, noParams=true)
    },
    'Arrived': (params) => {
        let api = 'Arrived'
        let title = `looks up arrival information for ${JSON.stringify(params)}`
        let check = (result, done) => {
            defaultResultCheck(result, ['next_offset', 'arrivals'])
            expect(result.next_offset).to.be.a('number')
            expect(result.arrivals).to.be.an('array')
            done()
        }
        runTest(title, api, params, check)
    },
    'BlockIdentCheck': (params) => {
        let api = 'BlockIdentCheck'
        let title = `looks up block ident for ${JSON.stringify(params)}`
        let check = (result, done) => {
            defaultResultCheck(result)
            // XXX:  not sure what a blocked response looks like
            done()
        }
        runTest(title, api, params, check)
    },
    'CountAirportOperations': (params) => {
        let api = 'CountAirportOperations'
        let title = `counts airport operations for ${params}`
        let check = (result, done) => {
            defaultResultCheck(result, ['enroute', 'departed', 'scheduled_departures', 'scheduled_arrivals'])
            done()
        }
        runTest(title, api, params, check)
    },
    'CountAllEnrouteAirlineOperations': () => {
        let api = 'CountAllEnrouteAirlineOperations'
        let title = `counts all enroute airline operations`
        let check = (result, done) => {
            defaultResultCheck(result, ['data'])
            expect(result.data).to.be.an('array')
            done()
        }
        runTest(title, api, undefined, check, noParams=true)
    },
    'DecodeFlightRoute': (params) => {
        let api = 'DecodeFlightRoute'
        let title = `decodes flight route for ${JSON.stringify(params)}`
        let check = (result, done) => {
            defaultResultCheck(result, ['next_offset', 'data'])
            expect(result.next_offset).to.be.a('number')
            expect(result.data).to.be.an('array')
            done()
        }
        runTest(title, api, params, check)
    },
    'DecodeRoute': (params) => {
        let api = 'DecodeRoute'
        let title = `decodes route between ${JSON.stringify(params)}`
        let check = (result, done) => {
            defaultResultCheck(result, ['next_offset', 'data'])
            expect(result.next_offset).to.be.a('number')
            expect(result.data).to.be.an('array')
            done()
        }
        runTest(title, api, params, check)
    },
    'DeleteAlert': (params) => {
        let api = 'DeleteAlert'
        let title = `deletes an alert: ${JSON.stringify(params)}`
        let check = (result, done) => {
            defaultResultCheck(result)
            expect(result).to.be.a('number')
            done()
        }
        runTest(title, api, params, check)
    },
    'Departed': (params) => {
        let api = 'Departed'
        let title = `looks up flights departing from an airport ${JSON.stringify(params)}`
        let check = (result, done) => {
            defaultResultCheck(result, ['next_offset', 'departures'])
            expect(result.next_offset).to.be.a('number')
            expect(result.departures).to.be.an('array')
            done()
        }
        runTest(title, api, params, check)
    },
    'FleetArrived': (params) => {
        let api = 'FleetArrived'
        let title = `looks up an airline's flights recently arrived ${JSON.stringify(params)}`
        let check = (result, done) => {
            defaultResultCheck(result, ['next_offset', 'arrivals'])
            expect(result.next_offset).to.be.a('number')
            expect(result.arrivals).to.be.an('array')
            done()
        }
        runTest(title, api, params, check)
    },
    'FleetScheduled': (params) => {
        let api = 'FleetScheduled'
        let title = `looks up an airline's flights scheduled to arrive ${JSON.stringify(params)}`
        let check = (result, done) => {
            defaultResultCheck(result, ['next_offset', 'scheduled'])
            expect(result.next_offset).to.be.a('number')
            expect(result.scheduled).to.be.an('array')
            done()
        }
        runTest(title, api, params, check)
    },
    'FlightInfo': (params) => {
        let api = 'FlightInfo'
        let title = `looks up flight information for ${JSON.stringify(params)}`
        let check = (result, done) => {
            defaultResultCheck(result, ['next_offset', 'flights'])
            expect(result.next_offset).to.be.a('number')
            expect(result.flights).to.be.an('array')
            done()
        }
        runTest(title, api, params, check)
    },
    'FlightInfoEx': (params) => {
        let api = 'FlightInfoEx'
        let title = `looks up extended flight information for ${JSON.stringify(params)}`
        let check = (result, done) => {
            defaultResultCheck(result, ['next_offset', 'flights'])
            expect(result.next_offset).to.be.a('number')
            expect(result.flights).to.be.an('array')
            done()
        }
        runTest(title, api, params, check)
    },
    'GetAlerts': () => {
        let api = 'GetAlerts'
        let title = `get alerts registered to the current user account`
        let check = (result, done) => {
            defaultResultCheck(result, ['num_alerts', 'alerts'])
            expect(result.num_alerts).to.be.a('number')
            expect(result.alerts).to.be.an('array')
            done()
        }
        runTest(title, api, undefined, check, noParams=true)
    },
    'GetFlightID': (params) => {
        let api = 'GetFlightID'
        let title = `looks up a flight for ${JSON.stringify(params)}`
        let check = (result, done) => {
            defaultResultCheck(result)
            expect(result).to.be.a('string')
            done()
        }
        runTest(title, api, params, check)
    },
    'GetHistoricalTrack': (params) => {
        let api = 'GetHistoricalTrack'
        let title = `looks up a historical track for ${JSON.stringify(params)}`
        let check = (result, done) => {
            defaultResultCheck(result, ['data'])
            expect(result.data).to.be.an('array')
            done()
        }
        runTest(title, api, params, check)
    },
    'GetLastTrack': (params) => {
        let api = 'GetLastTrack'
        let title = `looks up last track for ${JSON.stringify(params)}`
        let check = (result, done) => {
            defaultResultCheck(result, ['data'])
            expect(result.data).to.be.an('array')
            done()
        }
        runTest(title, api, params, check)
    },
    'InboundFlightInfo': (params) => {
        let api = 'InboundFlightInfo'
        let title = `looks up inbound flight info for ${JSON.stringify(params)}`
        let check = (result, done) => {
            defaultResultCheck(result)
            done()
        }
        runTest(title, api, params, check)
    },
    'InFlightInfo': (params) => {
        let api = 'InFlightInfo'
        let title = `looks up in flight information for ${JSON.stringify(params)}`
        let check = (result, done) => {
            defaultResultCheck(result, ['faFlightID', 'ident', 'prefix', 'type', 'suffix', 'origin', 'destination', 'timeout', 'timestamp', 'departureTime', 'firstPositionTime', 'arrivalTime', 'longitude', 'latitude', 'lowLongitude', 'lowLatitude', 'highLongitude', 'highLatitude', 'groundspeed', 'altitude', 'heading', 'altitudeStatus', 'updateType', 'altitudeChange', 'waypoints'])
            done()
        }
        runTest(title, api, params, check)
    },
    'LatLongsToDistance': (params) => {
        let api = 'LatLongsToDistance'
        let title = `computes distance between lat/long points: ${JSON.stringify(params)}`
        let check = (result, done) => {
            defaultResultCheck(result)
            expect(result).to.be.a('number')
            done()
        }
        runTest(title, api, params, check)
    },
    'LatLongsToHeading': (params) => {
        let api = 'LatLongsToHeading'
        let title = `computes heading between lat/long points: ${JSON.stringify(params)}`
        let check = (result, done) => {
            defaultResultCheck(result)
            expect(result).to.be.a('number')
            done()
        }
        runTest(title, api, params, check)
    },
    'MapFlight': (params) => {
        let api = 'MapFlight'
        let title = `creates flight image for: ${JSON.stringify(params)}`
        let check = (result, done) => {
            defaultResultCheck(result)
            expect(result).to.be.a('string')
            done()
        }
        runTest(title, api, params, check)
    },
    'MapFlightEx': (params) => {
        let api = 'MapFlightEx'
        let title = `creates detailed flight image for: ${JSON.stringify(params)}`
        let check = (result, done) => {
            defaultResultCheck(result)
            expect(result).to.be.a('string')
            done()
        }
        runTest(title, api, params, check)
    },
    'Metar': (params) => {
        let api = 'Metar'
        let title = `looks up weather for airport ${JSON.stringify(params)}`
        let check = (result, done) => {
            defaultResultCheck(result)
            expect(result).to.be.a('string')
            done()
        }
        runTest(title, api, params, check)
    },
    'MetarEx': (params) => {
        let api = 'MetarEx'
        let title = `looks up detailed weather for airport: ${JSON.stringify(params)}`
        let check = (result, done) => {
            defaultResultCheck(result, ['next_offset', 'metar'])
            expect(result.next_offset).to.be.a('number')
            expect(result.metar).to.be.an('array')
            done()
        }
        runTest(title, api, params, check)
    },
    'NTaf': (params) => {
        let api = 'NTaf'
        let title = `looks up in terminal area forecast for airport: ${JSON.stringify(params)}`
        let check = (result, done) => {
            defaultResultCheck(result, ['airport', 'timeString', 'forecast'])
            expect(result.airport).to.be.a('string')
            expect(result.timeString).to.be.a('string')
            expect(result.forecast).to.be.an('array')
            done()
        }
        runTest(title, api, params, check)
    },
    'RegisterAlertEndpoint': (params) => {
        let api = 'RegisterAlertEndpoint'
        let title = `registers alert endpoint for: ${JSON.stringify(params)}`
        let check = (result, done) => {
            defaultResultCheck(result)
            done()
        }
        runTest(title, api, params, check)
    },
    'RoutesBetweenAirports': (params) => {
        let api = 'RoutesBetweenAirports'
        let title = `looks up routes between airports: ${JSON.stringify(params)}`
        let check = (result, done) => {
            defaultResultCheck(result, ['data'])
            expect(result.data).to.be.an('array')
            done()
        }
        runTest(title, api, params, check)
    },
    'RoutesBetweenAirportsEx': (params) => {
        let api = 'RoutesBetweenAirportsEx'
        let title = `looks up detailed routes between airports: ${JSON.stringify(params)}`
        let check = (result, done) => {
            defaultResultCheck(result, ['next_offset', 'data'])
            expect(result.next_offset).to.be.a('number')
            expect(result.data).to.be.an('array')
            done()
        }
        runTest(title, api, params, check)
    },
    'Scheduled': (params) => {
        let api = 'Scheduled'
        let title = `looks up scheduled flights for airport: ${JSON.stringify(params)}`
        let check = (result, done) => {
            defaultResultCheck(result, ['next_offset', 'scheduled'])
            expect(result.next_offset).to.be.a('number')
            expect(result.scheduled).to.be.an('array')
            done()
        }
        runTest(title, api, params, check)
    },
    'Search': (params) => {
        let api = 'Search'
        let title = `looks up flights by parameters: ${JSON.stringify(params)}`
        let check = (result, done) => {
            defaultResultCheck(result, ['next_offset', 'aircraft'])
            expect(result.next_offset).to.be.a('number')
            expect(result.aircraft).to.be.an('array')
            done()
        }
        runTest(title, api, params, check)
    },
    'SearchBirdseyeInFlight': (params) => {
        let api = 'SearchBirdseyeInFlight'
        let title = `looks up in flight information by query: ${JSON.stringify(params)}`
        let check = (result, done) => {
            defaultResultCheck(result, ['next_offset', 'aircraft'])
            expect(result.next_offset).to.be.a('number')
            expect(result.aircraft).to.be.an('array')
            done()
        }
        runTest(title, api, params, check)
    },
    'SearchBirdseyePositions': (params) => {
        let api = 'SearchBirdseyePositions'
        let title = `looks up in flight information by position query: ${JSON.stringify(params)}`
        let check = (result, done) => {
            defaultResultCheck(result, ['next_offset', 'data'])
            expect(result.next_offset).to.be.a('number')
            expect(result.data).to.be.an('array')
            done()
        }
        runTest(title, api, params, check)
    },
    'SearchCount': (params) => {
        let api = 'SearchCount'
        let title = `looks up and counts flights by query: ${JSON.stringify(params)}`
        let check = (result, done) => {
            defaultResultCheck(result)
            expect(result).to.be.a('number')
            done()
        }
        runTest(title, api, params, check)
    },
    'SetMaximumResultSize': (params) => {
        let api = 'SetMaximumResultSize'
        let title = `sets maximum result size to ${JSON.stringify(params)}`
        let check = (result, done) => {
            defaultResultCheck(result)
            expect(result).to.be.a('number')
            done()
        }
        runTest(title, api, params, check)
    },
    'Taf': (params) => {
        let api = 'Taf'
        let title = `looks up terminal area forecast for: ${JSON.stringify(params)}`
        let check = (result, done) => {
            defaultResultCheck(result)
            done()
        }
        runTest(title, api, params, check)
    },
    'TailOwner': (params) => {
        let api = 'TailOwner'
        let title = `looks up owner by tail number: ${JSON.stringify(params)}`
        let check = (result, done) => {
            defaultResultCheck(result, ['owner', 'location', 'location2', 'website'])
            done()
        }
        runTest(title, api, params, check)
    },
    'ZipcodeInfo': (params) => {
        let api = 'ZipcodeInfo'
        let title = `looks up zipcode information for: ${JSON.stringify(params)}`
        let check = (result, done) => {
            defaultResultCheck(result)
            done()
        }
        runTest(title, api, params, check)
    }
}

for(const test of tests) {
    
    describe(test, function() {
        switch(test) {
            case 'AircraftType':
                _t[test]('GALX')
                break;

            case 'AirlineFlightInfo':
                _t[test]('N415PW@1442008560')
                break;

            case 'AirlineFlightSchedules':
                var now = Math.floor(Date.now()/1000);
                _t[test]({ origin: 'KSJC', howMany: 1 })
                _t[test]({ origin: 'KSJC', startDate: now, EndDate: now + 1*60*60, howMany: 1 })
                _t[test]({ origin: 'KSJC', startDate: now-1*60*60, EndDate: now, howMany: 1 })
                break;

            case 'AirlineInfo':
                _t[test]('UAL')
                break;

            case 'AirportInfo':
                _t[test]('SFO')
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
                break;

            case 'BlockIdentCheck':
                _t[test]('N415PW')
                break;

            case 'CountAirportOperations':
                _t[test]('KSFO')
                break;

            case 'CountAllEnrouteAirlineOperations':
                _t[test]()
                break;

            case 'DecodeFlightRoute':
                _t[test]('N415PW@1442008560')
                break;

            case 'DecodeRoute':
                _t[test]({ origin: 'KSQL', route: 'SJC V334 SAC SWR', destination: 'KTRK' })
                break;

            case 'DeleteAlert':
                _t[test]('1')
                break;

            case 'Departed':
                _t[test]({ airport: 'KSFO' })
                _t[test]({ airport: 'KSFO', howMany: 1, filter: 'airline', offset: 0 })
                _t[test]({ airport: 'KSFO', howMany: 1, filter: 'ga' })
                _t[test]({ airport: 'KSFO', howMany: 1 })
                break;

            case 'FleetArrived':
                _t[test]({ fleet: 'UAL', howMany: 1 })
                break;

            case 'FleetScheduled':
                _t[test]({ fleet: 'UAL', howMany: 1 })
                break;

            case 'FlightInfo':
                _t[test]({ ident: 'N415PW', howMany: 1 })
                break;

            case 'FlightInfoEx':
                _t[test]({ ident: 'N415PW', howMany: 1 })
                break;

            case 'GetAlerts':
                _t[test]()
                break;

            case 'GetFlightID':
                _t[test]({ ident: 'N415PW', departureTime: '1442008560' })
                break;

            case 'GetHistoricalTrack':
                _t[test]('N415PW@1442008560')
                break;

            case 'GetLastTrack':
                _t[test]('UAL1497')
                break;

            case 'InboundFlightInfo':
                _t[test]('N415PW-1442008613-adhoc-0')
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
                break;

            case 'MetarEx':
                _t[test]({ airport: 'KSFO', howMany: 1 })
                break;

            case 'NTaf':
                _t[test]('KSFO')
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
                break;

            case 'TailOwner':
                _t[test]('N415PW')
                break;

            case 'ZipcodeInfo':
                _t[test]('95060')
                break;

            default:
                console.log("Unimplemented API test:", test);
                break;
        }
    });
}
