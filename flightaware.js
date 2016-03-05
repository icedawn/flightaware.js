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
                var results = null;
                var err = null;
                try {
                    var json = JSON.parse(body);
                    results = json[method + 'Result'];
                } catch(e) {
                    err = { error: e, text: body };
                }
                callback(err, results);
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
    var query = { "type" : aircraftType };
    this._request("AircraftType", query, callback)
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
    var query = { "faFlightID" : faFlightID };
    this._request("AirlineFlightInfo", query, callback)
};

/*
 * AirlineFlightSchedules returns flight schedules that have been published by 
 * airlines.  These schedules are available for the recent past as well as up 
 * to one year into the future.  Flights performed by airline codeshares are 
 * also returned in these results.
 *
 * Parameters:
 *  query           object      query parameters (defined below)
 *  {
 *      startDate       int         (default now) timestamp of earliest flight 
 *                                  departure to return, specified in integer 
 *                                  seconds since 1970 (UNIX epoch time)
 *      endDate         int         (default startDate+day) timestamp of latest 
 *                                  flight departure to return, specified in 
 *                                  integer seconds since 1970 (UNIX epoch time)
 *      origin          string      (optional) airport code of origin. If blank
 *                                  or unspecified, then flights with any origin
 *                                  will be returned.
 *      destination     string      (optional) airport code of destination. If
 *                                  blank or unspecified, then flights with any 
 *                                  destination will be returned.
 *      airline         string      (optional) airline code of the carrier. If 
 *                                  blank or unspecified, then flights on any 
 *                                  airline will be returned.
 *      flightno        string      (optional) flight number. If blank or 
 *                                  unspecified, then any flight number will be
 *                                  returned.
 *      howMany         int         (default 15) maximum number of past records
 *                                  to obtain. Must be a positive integer value 
 *                                  less than or equal to 15, unless 
 *                                  SetMaximumResultSize has been called.
 *      offset          int         (default 0) must be an integer value of 
 *                                  the offset row count you want the search to
 *                                  start at. Most requests should be 0 (most 
 *                                  recent report).
 *  }
 *  callback        function    async completion callback
 *
 * Returns:
 *  undefined
 *
 * Async callback:  callback(err, result)
 *  err             object      undefined or error information
 *  result          object      ArrayOfAirlineFlightScheduleStruct
 */
FlightAware.prototype.AirlineFlightSchedules = function(query, callback) {
    if ( !('startDate' in query)) query.startDate = Math.floor(Date.now()/1000);
    if ( !('endDate' in query)) query.endDate = query.startDate + 24*60*60;
    this._request("AirlineFlightSchedules", query, callback)
};

/*
 * AirlineInfo returns information about a commercial airline/carrier given 
 * an ICAO airline code.
 *
 * Parameters:
 *  airlineCode     string      the ICAO airline ID (e.g., COA, ASA, UAL, etc.)
 *  callback        function    async completion callback
 *
 * Returns:
 *  undefined
 *
 * Async callback:  callback(err, result)
 *  err             object      undefined or error information
 *  result          object      AirlineInfoStruct
 */
FlightAware.prototype.AirlineInfo = function(airlineCode, callback) {
    var query = { "airlineCode" : airlineCode };
    this._request("AirlineInfo", query, callback)
};

/*
 * AirlineInsight returns historical booking and airfare information that has 
 * been published by airlines. Currently this information is only available for
 * airports located within the United States and its territories. Information is
 * historical and is aggregated from the 12 months prior to the most recently 
 * published (generally 4 to 6 months delayed).  The returned data may involve 
 * estimated or extrapolated amounts.  
 *
 * This function can return one of several types of reports, as specified by 
 * the reportType argument:
 * 
 *      1 = Alternate route popularity with fares
 *      2 = Percentage of scheduled flights that are actually flown
 *      3 = Passenger load factor of flights that are actually flown
 *      4 = Carriers by most cargo weight
 *
 * Parameters:
 *  airlineCode     string      the ICAO airline ID (e.g., COA, ASA, UAL, etc.)
 *  query           object      query parameters (defined below)
 *  {
 *      origin          string  airport code of origin
 *      destination     string  airport code of destination
 *      reportType      int     type of report to obtain (see list of values above)
 *  }
 *  callback        function    async completion callback
 *
 * Returns:
 *  undefined
 *
 * Async callback:  callback(err, result)
 *  err             object      undefined or error information
 *  result          object      ArrayOfAirlineInsightStruct
 */
FlightAware.prototype.AirlineInsight = function(query, callback) {
    if ( !('reportType' in query)) query.reportType = 2;
    this._request("AirlineInsight", query, callback)
};

/*
 * AirportInfo returns information about an airport given an ICAO airport code such 
 * as KLAX, KSFO, KORD, KIAH, O07, etc.  Data returned includes name (Houston 
 * Intercontinental Airport), location (typically city and state), latitude and 
 * longitude, and timezone (:America/Chicago).  
 *
 * The returned timezone is specified in a format that is compatible with the official
 * IANA zoneinfo database and can be used to convert the timestamps returned by all 
 * other functions into localtimes.  Support for timestamp conversion using zoneinfo 
 * identifiers is available natively or through third-party libraries for most 
 * programming languages. In some cases, the leading colon (":") character may need to 
 * be removed from the timezone identifier in order for it to be recognized by some 
 * timezone libraries.
 *
 * Parameters:
 *  airportCode	    string	    the ICAO airport ID (e.g., KLAX, KSFO, KIAH, KHOU, 
 *                              KJFK, KEWR, KORD, KATL, etc.)
 *  callback        function    async completion callback
 *
 * Returns:
 *  undefined
 *
 * Async callback:  callback(err, result)
 *  err             object      undefined or error information
 *  result          object      AirportInfoStruct
 */
FlightAware.prototype.AirportInfo = function(airportCode, callback) {
    var query = { 'airportCode' : airportCode };
    this._request("AirportInfo", query, callback)
};

/*
 * AllAirlines returns the ICAO identifiers of all known commercial airlines/carriers.
 * See AirlineInfo to retrieve additional information about any of the identifiers 
 * returned.
 *
 * Parameters:
 *  callback        function    async completion callback
 *
 * Returns:
 *  undefined
 *
 * Async callback:  callback(err, result)
 *  err             object      undefined or error information
 *  result          object      ArrayOfString
 */
FlightAware.prototype.AllAirlines = function(callback) {
    this._request("AllAirlines", {}, callback)
};

/*
 * AllAirports returns the ICAO identifiers of all known airports. For airports that 
 * do not have an ICAO identifier, the FAA LID identifier will be used.
 * See AirportInfo to retrieve additional information about any of the identifiers 
 * returned.
 *
 * Parameters:
 *  callback        function    async completion callback
 *
 * Returns:
 *  undefined
 *
 * Async callback:  callback(err, result)
 *  err             object      undefined or error information
 *  result          object      ArrayOfString
 */
FlightAware.prototype.AllAirports = function(callback) {
    this._request("AllAirports", {}, callback)
};

/*
 * Arrived returns information about flights that have recently arrived for the 
 * specified airport and maximum number of flights to be returned. Flights are 
 * returned from most to least recent. Only flights that arrived within the last 
 * 24 hours are considered.  
 *
 * Times returned are seconds since 1970 (UNIX epoch seconds).  
 *
 * See also Departed, Enroute, and Scheduled for other airport tracking functionality.

 *
 * Parameters:
 *  query
 *  {
 *      airport	    string	    the ICAO airport ID (e.g., KLAX, KSFO, KIAH, KHOU, KJFK,
 *                              KEWR, KORD, KATL, etc.)
 *      howMany	    int	        determines the number of results. Must be a positive 
 *                              integer value less than or equal to 15, unless 
 *                              SetMaximumResultSize has been called.
 *      filter	    string	    can be "ga" to show only general aviation traffic, 
 *                              "airline" to only show airline traffic, or null/empty 
 *                              to show all raffic.
 *      offset	    int	        must be an integer value of the offset row count you 
 *                              want the search to start at. Most requests should be 0.
 *  }
 *  callback        function    async completion callback
 *
 * Returns:
 *  undefined
 *
 * Async callback:  callback(err, result)
 *  err             object      undefined or error information
 *  result          object      ArrayOfArrivalStruct
 */
FlightAware.prototype.Arrived = function(query, callback) {
    this._request("Arrived", query, callback)
};

/*
 * Given an aircraft identification, returns 1 if the aircraft is blocked from public 
 * tracking, 0 if it is not.
 *
 * Parameters:
 *  ident           string      requested tail number
 *  callback        function    async completion callback
 *
 * Returns:
 *  undefined
 *
 * Async callback:  callback(err, result)
 *  err             object      undefined or error information
 *  result          int         1=blocked, 0=not blocked
 */
FlightAware.prototype.BlockIdentCheck = function(ident, callback) {
    var query = { ident : ident };
    this._request("BlockIdentCheck", query, callback)
};

/*
 * Given an airport, CountAirportOperations returns integer values on the number 
 * of aircraft scheduled or actually en route or departing from the airport. Scheduled 
 * arrival is a non-airborne flight that is scheduled to the airport in question.
 *
 * Parameters:
 *  airport         string      airport code
 *  callback        function    async completion callback
 *
 * Returns:
 *  undefined
 *
 * Async callback:  callback(err, result)
 *  err             object      undefined or error information
 *  result          object      CountAirportOperationsStruct
 */
FlightAware.prototype.CountAirportOperations = function(airport, callback) {
    var query = { airport : airport };
    this._request("CountAirportOperations", query, callback)
};

/*
 * CountAllEnrouteAirlineOperations returns an array of airlines and how many flights 
 * each currently has enroute.
 *
 * Parameters:
 *  callback        function    async completion callback
 *
 * Returns:
 *  undefined
 *
 * Async callback:  callback(err, result)
 *  err             object      undefined or error information
 *  result          int         ArryOfCountAirportOperationsStruct
 */
FlightAware.prototype.CountAllEnrouteAirlineOperations = function(callback) {
    this._request("CountAllEnrouteAirlineOperations", {}, callback)
};

/*
 * Given a flight identifier (faFlightID) of a past, current, or future flight, 
 * DecodeFlightRoute returns a "cracked" list of noteworthy navigation points along 
 * the planned flight route. The list represents the originally planned route of 
 * travel, which may differ slightly from the actual flight path flown. 
 *
 * The returned list will include the name, type, latitude, and longitude of each 
 * point. Additional reporting points along the route may be automatically included 
 * in the returned list. Not all flight routes can be successfully decoded by this 
 * function, particularly if the flight is not entirely within the continental U.S. 
 * airspace, since this function only has access to navaids within that area. To 
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
 *  result          int         ArrayOfFlightRouteStruct
 */
FlightAware.prototype.DecodeFlightRoute = function(faFlightID, callback) {
    var query = { faFlightID : faFlightID };
    this._request("DecodeFlightRoute", query, callback)
};

/*
 * Given an origin airport, destination airport, and a route between them, DecodeRoute 
 * returns a "cracked" list of noteworthy navigation points along the planned flight 
 * route. The list represents the originally planned route of travel, which may differ 
 * slightly from the actual flight path flown. The returned list will include the name,
 * type, latitude, and longitude of each point. Additional reporting points along the 
 * route may be automatically included in the returned list.  Not all flight routes can 
 * be successfully decoded by this function, particularly if the flight is not entirely 
 * within the continental U.S. airspace, since this function only has access to navaids 
 * within that area.
 *
 * For an alternate version of this function that lets you specify an existing flight 
 * identifier, see DecodeFlightRoute.
 *
 * Parameters:
 *  query
 *  {
 *      origin          string  airport code of origin
 *      route           string  space separated list of intersections and/or VORs 
 *                              along the route
 *      destination     string  airport code of destination
 *  }
 *  callback        function    async completion callback
 *
 * Returns:
 *  undefined
 *
 * Async callback:  callback(err, result)
 *  err             object      undefined or error information
 *  result          int         ArrayOfFlightRouteStruct
 */
FlightAware.prototype.DecodeRoute = function(query, callback) {
    this._request("DecodeRoute", query, callback)
};

/*
 * DeleteAlert deletes a FlightXML flight alert.  
 *
 * The other methods SetAlert, GetAlerts, and RegisterAlertEndpoint can be used to 
 * manage FlightXML flight alerts.
 *
 * Parameters:
 *  alert_id        int         alert_id to delete
 *  callback        function    async completion callback
 *
 * Returns:
 *  undefined
 *
 * Async callback:  callback(err, result)
 *  err             object      undefined or error information
 *  result          int         1=success
 */
FlightAware.prototype.DeleteAlert = function(alertId, callback) {
    if(alertId) {
        var query = { 'alert_id' : alertId };
        this._request("DeleteAlert", query, callback)
    }
};

/*
 * Departed returns information about already departed flights for a specified airport 
 * and maximum number of flights to be returned. Departed flights are returned in order
 * from most recently to least recently departed.  Only flights that have departed within
 * the last 24 hours are considered.  
 *
 * Times returned are seconds since 1970 (UNIX epoch seconds).  
 *
 * See also Arrived, Enroute, and Scheduled for other airport tracking functionality.
 *
 * Parameters:
 *  query
 *  {
 *      airport	    string	    the ICAO airport ID (e.g., KLAX, KSFO, KIAH, KHOU, KJFK,
 *                              KEWR, KORD, KATL, etc.)
 *      howMany	    int	        determines the number of results. Must be a positive 
 *                              integer value less than or equal to 15, unless 
 *                              SetMaximumResultSize has been called.
 *      filter	    string	    can be "ga" to show only general aviation traffic, 
 *                              "airline" to only show airline traffic, or null/empty 
 *                              to show all raffic.
 *      offset	    int	        must be an integer value of the offset row count you 
 *                              want the search to start at. Most requests should be 0.
 *  }
 *  callback        function    async completion callback
 *
 * Returns:
 *  undefined
 *
 * Async callback:  callback(err, result)
 *  err             object      undefined or error information
 *  result          int         DepartureStruct
 */
FlightAware.prototype.Departed = function(query, callback) {
    this._request("Departed", query, callback)
};

/*
 * FleetArrived returns information about recently arrived flights belonging to an 
 * aircraft fleet. Only flights that have arrived within the last 24 hours are 
 * considered. Codeshares and alternate idents are NOT considered.  
 *
 * The next_offset value returned advises an application of the next offset to use 
 * (if more data is available).  
 *
 * Times returned are seconds since 1970 (UNIX epoch seconds).  
 *
 * See also FleetScheduled for other fleet tracking functionality.
 *
 * Parameters:
 *  query
 *  {
 *      fleet	    string	    must be an ICAO prefix (e.g., COA, DAL, UAL, OPT, etc.)
 *      howMany	    int	        determines the number of results. Must be a positive 
 *                              integer value less than or equal to 15, unless 
 *                              SetMaximumResultSize has been called.
 *      offset	    int	        must be an integer value of the offset row count you 
 *                              want the search to start at. Most requests should be 0.
 *  }
 *  callback        function    async completion callback
 *
 * Returns:
 *  undefined
 *
 * Async callback:  callback(err, result)
 *  err             object      undefined or error information
 *  result          int         ArrivalStruct
 */
FlightAware.prototype.FleetArrived = function(query, callback) {
    this._request("FleetArrived", query, callback)
};

/*
 * FleetScheduled returns information about scheduled flights belonging to an aircraft 
 * fleet. Scheduled flights are returned from soonest to furthest in the future to 
 * depart. Only flights that have not actually departed, and have a scheduled departure 
 * time between 2 hours in the past and 24 hours in the future, are considered. 
 * Codeshares and alternate idents are NOT considered.
 *
 * The next_offset value returned advises an application of the next offset to use 
 * (if more data is available).  
 *
 * Times returned are seconds since 1970 (UNIX epoch time).  
 *
 * See also FleetArrived for other fleet tracking functionality.
 *
 * Parameters:
 *  query
 *  {
 *      fleet	    string	    must be an ICAO prefix (e.g., COA, DAL, UAL, OPT, etc.)
 *      howMany	    int	        determines the number of results. Must be a positive 
 *                              integer value less than or equal to 15, unless 
 *                              SetMaximumResultSize has been called.
 *      offset	    int	        must be an integer value of the offset row count you 
 *                              want the search to start at. Most requests should be 0.
 *  }
 *  callback        function    async completion callback
 *
 * Returns:
 *  undefined
 *
 * Async callback:  callback(err, result)
 *  err             object      undefined or error information
 *  result          int         ScheduledStruct
 */
FlightAware.prototype.FleetScheduled = function(query, callback) {
    this._request("FleetScheduled", query, callback)
};

/*
 * FlightInfo returns information about flights for a specific tail number (e.g., 
 * N12345), or ICAO airline code with flight number (e.g., SWA2558).  
 *
 * The howMany argument specifies the maximum number of flights to be returned. Flight
 * information will be returned from newest to oldest.  The oldest flights searched by 
 * this function are about 2 weeks in the past.  
 *
 * When specifying an airline with flight number, wither an ICAO or IATA code may be 
 * used to designate the airline, however andCodeshares and alternate idents are 
 * automatically searched.  
 *
 * Times are in integer seconds since 1970 (UNIX epoch time), except for estimated 
 * time enroute, which is in hours and minutes.  
 *
 * See FlightInfoEx for a more advanced interface.
 *
 * Parameters:
 *  query
 *  {
 *      ident	    string	    requested tail number, or airline with flight number
 *      howMany	    int	        determines the number of results. Must be a positive 
 *                              integer value less than or equal to 15, unless 
 *                              SetMaximumResultSize has been called.
 *      offset	    int	        must be an integer value of the offset row count you 
 *                              want the search to start at. Most requests should be 0.
 *  }
 *  callback        function    async completion callback
 *
 * Returns:
 *  undefined
 *
 * Async callback:  callback(err, result)
 *  err             object      undefined or error information
 *  result          int         FlightInfoStruct
 */
FlightAware.prototype.FlightInfo = function(query, callback) {
    this._request("FlightInfo", query, callback)
};

module.exports = FlightAware;
