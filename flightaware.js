var request = require('request');

function FlightAware(username,apiKey) {
    this.username = username || {};
    this.apiKey = apiKey || {};
}

FlightAware.host = "flightxml.flightaware.com";
FlightAware.baseURI = "/json/FlightXML2/";
FlightAware.URL = "http://" + FlightAware.host + FlightAware.baseURI;
FlightAware.maxRecords = 15;
FlightAware.maxRetries = 3;

FlightAware.airlineInsightReportType = {
    ALTERNATE_ROUTE_POPULARITY : 1,
    PERCENTAGE_SCHEDULED_ACTUALLY_FLOWN : 2,
    PASSENGER_LOAD_FACTOR_ACTUALLY_FLOWN : 3,
    CARRIERS_BY_CARGO_WEIGHT : 4
};

FlightAware.prototype.setCredentials = function(username, apiKey) {
    this.username = username || {};
    this.apiKey = apiKey || {};
};

FlightAware.prototype._request = function(method, data, callback) {
    request.post({
        uri : FlightAware.URL + method,
        form : data,
        auth : {
            user : this.username,
            pass : this.apiKey,
            sendImmediately : false
        },
        rejectUnauthorized : false,
    }, function(err, res, body) {
        if(err) {
            callback(err, null);
        }
        else {
            var code = res.statusCode;
            if(code != 200) {
                switch(code) {
                    case 401:
                        callback({ error: "unauthorized", code: code, text: body });
                        break;
                    case 410:
                        callback({ error: "invalid request URI", code: code, text: body });
                        break;
                    default:
                        callback({ error: "bad request", code: code, text: body });
                        break;
                }
            }
            else {
                try {
                    callback(null, JSON.parse(body));
                } catch(e) {
                    callback({ error: e, text: body }, null);
                }
            }
        }
    });
};

/*
 * Given an aircraft type string such as GALX, AircraftType returns information 
 * about that type,  comprising the manufacturer  (for instance, "IAI"), type 
 * (for instance, "Gulfstream G200"), and description (like "twin-jet").
 *
 * Parameters:
 *  aircraftType    string      aircraft type ID
 *  callback        function    async completion callback
 *
 * Returns:
 *  undefined
 *
 * Async callback:  callback(err, result)
 *  err             object      undefined or error information
 *  result          object      AircraftTypeStruct
 */
FlightAware.prototype.AircraftType = function(aircraftType, callback) {
    var data = { "type" : aircraftType };
    this._request("AircraftType", data, callback)
};

/*
 * AirlineFlightInfo returns additional information about a commercial airline 
 * flight, such as gate, baggage claim, and meal service information. This 
 * information is currently only available for some carriers and flights. To 
 * obtain the faFlightID, you can use a function such as GetFlightID, FlightInfoEx, 
 * or InFlightInfo.  
 *
 * Parameters:
 *  faFlightID      string      unique identifier assigned by FlightAware for this 
 *                              flight (or use "ident@departureTime")
 *  callback        function    async completion callback
 *
 * Returns:
 *  undefined
 *
 * Async callback:  callback(err, result)
 *  err             object      undefined or error information
 *  result          object      AirlineFlightInfoStruct
 */
FlightAware.prototype.AirlineFlightInfo = function(faFlightID, callback) {
    var data = { "faFlightID" : faFlightID };
    this._request("AirlineFlightInfo", data, callback)
};


module.exports = FlightAware;
