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
 *  result          object      ArrayOfCountAirportOperationsStruct
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
 *  result          object      ArrayOfFlightRouteStruct
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
 *  result          object      ArrayOfFlightRouteStruct
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
 *  result          object      DepartureStruct
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
 *  result          object      ArrivalStruct
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
 *  result          object      ScheduledStruct
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
 *  result          object      FlightInfoStruct
 */
FlightAware.prototype.FlightInfo = function(query, callback) {
    this._request("FlightInfo", query, callback)
};

/*
 * FlightInfoEx returns information about flights for a specific tail number (e.g., 
 * N12345), or an ident (typically an ICAO airline with flight number, e.g., SWA2558),
 * or a FlightAware-assigned unique flight identifier (e.g. faFlightID returned by 
 * another FlightXML function).  
 *
 * The howMany argument specifies the maximum number of flights to be returned. When a 
 * tail number or ident is specified and multiple flights are available, the results 
 * will be returned from newest to oldest. The oldest flights searched by this function 
 * are about 2 weeks in the past.
 *
 * Codeshares and alternate idents are automatically searched. When a FlightAware-assigned
 * unique flight identifier is supplied, at most a single result will be returned.  
 *
 * Times are in integer seconds since 1970 (UNIX epoch time), except for estimated time 
 * enroute, which is in hours and minutes.  
 *
 * See FlightInfo for a simpler interface.
 *
 * Parameters:
 *  query
 *  {
 *      ident	    string	    requested tail number, or airline with flight number, or 
 *                              faFlightID, or "ident@departureTime"
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
 *  result          object      FlightInfoExStruct
 */
FlightAware.prototype.FlightInfoEx = function(query, callback) {
    this._request("FlightInfoEx", query, callback)
};

/*
 * GetAlerts retrieves all of the FlightXML flight alerts that are currently scheduled 
 * for the user.  
 *
 * The other methods SetAlert, DeleteAlert, and RegisterAlertEndpoint can be used to 
 * manage FlightXML flight alerts.  
 *
 * Note: If other alerts have been defined by the user on the FlightAware website or 
 * mobile app, they will also be included in the returned listing.
 *
 * Parameters:
 *  callback        function    async completion callback
 *
 * Returns:
 *  undefined
 *
 * Async callback:  callback(err, result)
 *  err             object      undefined or error information
 *  result          object      FlightAlertListing
 */
FlightAware.prototype.GetAlerts = function(callback) {
    this._request("GetAlerts", {}, callback)
};

/*
 * GetFlightID looks up the "faFlightID" for a given ident and departure time. This 
 * value is a unique identifier assigned by FlightAware as a way to permanently 
 * identify a flight. The specified departure time must exactly match either the actual
 * or scheduled departure time of the flight. The departureTime is specified as integer 
 * seconds since 1970 (UNIX epoch time).  
 *
 * If more than one flight corresponds to the specified ident and departure time, then 
 * only the first matching faFlightID is returned. Codeshares and alternate idents are 
 * automatically searched.
 *
 * Parameters:
 *  query
 *  {
 *      ident	        string      requested tail number
 *      departureTime   int         time and date of the desired flight, UNIX epoch 
 *                                  seconds since 1970
 *  }
 *  callback            function    async completion callback
 *
 * Returns:
 *  undefined
 *
 * Async callback:  callback(err, result)
 *  err             object      undefined or error information
 *  result          string      returned faFlightID
 */
FlightAware.prototype.GetFlightID = function(query, callback) {
    this._request("GetFlightID", query, callback)
};

/*
 * GetHistoricalTrack looks up a past flight's track log by its unique identifier. To 
 * obtain the faFlightID, you can use a function such as GetFlightID, FlightInfoEx, or 
 * InFlightInfo.  
 *
 * This function returns an array of positions, with each including the timestamp, 
 * longitude, latitude, groundspeed, altitude, altitudestatus, updatetype, and 
 * altitudechange. Altitude is in hundreds of feet or Flight Level where appropriate, 
 * see our FAQ about flight levels. Also included is altitude status, update type, and 
 * altitude change.  
 * 
 * Altitude status is 'C' when the flight is more than 200 feet away from its 
 * ATC-assigned altitude. (For example, the aircraft is transitioning to its assigned 
 * altitude.) Altitude change is 'C' if the aircraft is climbing (compared to the 
 * previous position reported), 'D' for descending, and empty if it is level. This 
 * happens for VFR flights with flight following, among other things. Timestamp is 
 * integer seconds since 1970 (UNIX epoch time).  
 *
 * Use the GetLastTrack function to look up just the most recent flight rather than 
 * a specific historical one.
 *
 * Parameters:
 *  faFlightID      string      unique identifier assigned by FlightAware for the 
 *                              desired flight (or use "ident@departureTime")
 *  callback        function    async completion callback
 *
 * Returns:
 *  undefined
 *
 * Async callback:  callback(err, result)
 *  err             object      undefined or error information
 *  result          object      ArrayOfTrackStruct
 */
FlightAware.prototype.GetHistoricalTrack = function(faFlightID, callback) {
    var query = { faFlightID : faFlightID };
    this._request("GetHistoricalTrack", query, callback)
};

/*
 * GetLastTrack looks up a flight's track log by specific tail number (e.g., N12345) or 
 * ICAO airline and flight number (e.g., SWA2558). It returns the track log from the 
 * current IFR flight or, if the aircraft is not airborne, the most recent IFR flight.
 * It returns an array of positions, with each including the timestamp, longitude, 
 * latitude, groundspeed, altitude, altitudestatus, updatetype, and altitudechange. 
 * Altitude is in hundreds of feet or Flight Level where appropriate, see our FAQ about 
 * flight levels. Also included altitude status, update type, and altitude change.
 *
 * Altitude status is 'C' when the flight is more than 200 feet away from its 
 * ATC-assigned altitude. (For example, the aircraft is transitioning to its assigned 
 * altitude.) Altitude change is 'C' if the aircraft is climbing (compared to the 
 * previous position reported), 'D' for descending, and empty if it is level. This 
 * happens for VFR flights with flight following, among other things. Timestamp is 
 * integer seconds since 1970 (UNIX epoch time).
 * 
 * This function only returns tracks for recent flights within approximately the last 
 * 24 hours. Use the GetHistoricalTrack function to look up a specific past flight 
 * rather than just the most recent one. Codeshares and alternate idents are 
 * automatically searched.
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
 *  result          object      ArrayOfTrackStruct
 */
FlightAware.prototype.GetLastTrack = function(ident, callback) {
    var query = { ident : ident };
    this._request("GetLastTrack", query, callback)
};

/*
 * InboundFlightInfo returns information about the flight being served by the same 
 * aircraft that will service a future flight. To obtain the faFlightID, you can use 
 * a function such as GetFlightID, FlightInfoEx, or InFlightInfo.  
 *
 * The inbound flight can only be determined with accuracy for some commercial airlines.
 * If the inbound flight cannot be determined, an error will be returned.  
 *
 * Times are in integer seconds since 1970 (UNIX epoch time), except for estimated time 
 * enroute, which is in hours and minutes.
 *
 * Parameters:
 *  faFlightID      string      unique identifier assigned by FlightAware for the 
 *                              desired flight (or use "ident@departureTime")
 *  callback        function    async completion callback
 *
 * Returns:
 *  undefined
 *
 * Async callback:  callback(err, result)
 *  err             object      undefined or error information
 *  result          object      FlightExStruct
 */
FlightAware.prototype.InboundFlightInfo = function(faFlightID, callback) {
    var query = { faFlightID : faFlightID };
    this._request("InboundFlightInfo", query, callback)
};

/*
 * InFlightInfo looks up a specific tail number (e.g., N12345) or ICAO airline and 
 * flight number (e.g., SWA2558) and returns current position/direction/speed 
 * information. It is only useful for currently airborne flights within approximately 
 * the last 24 hours. Codeshares and alternate idents are automatically searched.
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
 *  result          object      InFlightAircraftStruct
 */
FlightAware.prototype.InFlightInfo = function(ident, callback) {
    var query = { ident : ident };
    this._request("InFlightInfo", query, callback)
};

/*
 * Given two latitudes and longitudes, lat1 lon1 lat2 and lon2, respectively, determine 
 * the great circle distance between those positions in miles. The returned distance is 
 * rounded to the nearest whole mile.
 *
 * Parameters:
 *  query
 *  {
 *      lat1            float       Latitude of point 1
 *      lon1            float       Longitude of point 1
 *      lat2            float       Latitude of point 2
 *      lon2            float       Longitude of point 2
 *  }
 *  callback            function    async completion callback
 *
 * Returns:
 *  undefined
 *
 * Async callback:  callback(err, result)
 *  err             object      undefined or error information
 *  result          int         returned distance
 */
FlightAware.prototype.LatLongsToDistance = function(query, callback) {
    this._request("LatLongsToDistance", query, callback)
};

/*
 * Given two latitudes and longitudes, lat1 lon1 lat2 and lon2, respectively, calculate 
 * and return the initial compass heading (where 360 is North) from position one to 
 * position two. Quite accurate for relatively short distances but since it assumes the 
 * earth is a sphere rather than on irregular oblate sphereoid may be inaccurate for 
 * flights around a good chunk of the world, etc.
 *
 * Parameters:
 *  query
 *  {
 *      lat1            float       Latitude of point 1
 *      lon1            float       Longitude of point 1
 *      lat2            float       Latitude of point 2
 *      lon2            float       Longitude of point 2
 *  }
 *  callback            function    async completion callback
 *
 * Returns:
 *  undefined
 *
 * Async callback:  callback(err, result)
 *  err             object      undefined or error information
 *  result          int         returned heading
 */
FlightAware.prototype.LatLongsToHeading = function(query, callback) {
    this._request("LatLongsToHeading", query, callback)
};

/*
 * This function will return a base64 encoded GIF or PNG image (with the height and 
 * width as specified in pixels) of the current flight of a specified ident. If the 
 * aircraft is not currently in the air, then a blank image may be returned. Codeshares 
 * and alternate idents are automatically searched.  
 *
 * See MapFlightEx for a more advanced interface with historical flight capabilities.
 *
 * Parameters:
 *  query
 *  {
 *      ident           string      requested tail number
 *      mapHeight       int         height of requested image, in pixels
 *      mapWidth        int         width of requested image, in pixels
 *  }
 *  callback            function    async completion callback
 *
 * Returns:
 *  undefined
 *
 * Async callback:  callback(err, result)
 *  err             object      undefined or error information
 *  result          string      returned image data
 */
FlightAware.prototype.MapFlight = function(query, callback) {
    this._request("MapFlight", query, callback)
};

/*
 * This function will return a base64 encoded GIF or PNG image (with the height and 
 * width as specified in pixels) of a specific flight. The flight may be a current or 
 * historical flight, but it must be specified using the unique FlightAware-assigned 
 * identifier for the desired flight. To obtain the faFlightID, you can use a function 
 * such as GetFlightID, FlightInfoEx, or InFlightInfo.  
 *
 * The layer_on and layer_off arguments are specify what map features to include or 
 * exclude. The available layers and its default mode is shown below: 
 *
 *      "US Cities" (Default: off)
 *      "european country boundaries" (Default: off)
 *      "asia country boundaries" (Default: off)
 *      "country boundaries" (Default: on)
 *      "US state boundaries" (Default: on)
 *      "water" (Default: on)
 *      "US urban areas" (Default: off)
 *      "US major roads" (Default: on)
 *      "radar" (Default: on)
 *      "track" (Default: on)
 *      "flights" (Default: on)
 *      "major airports" (Default: on)
 *      "airports" (Default: on)
 *
 * See MapFlight for a simpler interface.
 *
 * Parameters:
 *  query
 *  {
 *      faFlightID              string      unique identifier assigned by FlightAware 
 *                                          for the desired flight (or use 
 *                                          "ident@departureTime")
 *      mapHeight               int         height of requested image, in pixels
 *      mapWidth                int         width of requested image, in pixels
 *      layer_on                string()    optional list of map layer names to enable
 *      layer_off               string()    optional list of map layer names to disable
 *      show_data_blocks        bool        if true, a textual caption of the ident, 
 *                                          type, heading, altitude, origin, and 
 *                                          destination will be displayed below the 
 *                                          flight position.
 *      show_airports           bool        if true, show the origin/destination 
 *                                          airports as dots with textual labels.
 *      airports_expand_view    bool        if true, force zoom area to ensure 
 *                                          origin/destination airports are visible.  
 *                                          show_airports must also be true to use this 
 *                                          feature.
 *      latlon_box              float()     optionally specify the zoom area. if 
 *                                          specified, should be a list of 4 elements 
 *                                          (hilat, lowlon, lowlat, hilon), otherwise an 
 *                                          automatic zoom will be used.
 *  }
 *  callback                    function    async completion callback
 *
 * Returns:
 *  undefined
 *
 * Async callback:  callback(err, result)
 *  err             object      undefined or error information
 *  result          string      returned image data
 */
FlightAware.prototype.MapFlightEx = function(query, callback) {
    this._request("MapFlightEx", query, callback)
};

/*
 * Given an airport, return the current raw METAR weather info. If no reports are 
 * available at the requested airport but are for a nearby airport, then the report 
 * from that airport may be returned instead.  
 * 
 * Use the MetarEx function for more functionality, including access to historical 
 * weather and parsed.
 
 * Parameters:
 *  airport	    string	    the ICAO airport ID (e.g., KLAX, KSFO, KIAH, KHOU, KJFK, 
 *                          KEWR, KORD, KATL, etc.)
 *  callback    function    async completion callback
 *
 * Returns:
 *  undefined
 *
 * Async callback:  callback(err, result)
 *  err             object      undefined or error information
 *  result          string      metar data
 */
FlightAware.prototype.Metar = function(airport, callback) {
    var query = { airport : airport };
    this._request("Metar", query, callback)
};

/*
 * Given an airport, return the METAR weather info as parsed, human-readable, and raw 
 * formats. If no reports are available at the requested airport but are for a nearby 
 * airport, then the reports from that airport may be returned instead.  
 *
 * If a value greater than 1 is specified for howMany then multiple past reports will be 
 * returned, in order of increasing age. Historical data is generally only available for 
 * the last 7 days.  
 *
 * Use the Metar function for a simpler interface to access just the most recent raw 
 * report.
 *
 * Parameters:
 *  query
 *  {
 *      airport	    string	    the ICAO airport ID (e.g., KLAX, KSFO, KIAH, KHOU, KJFK, 
 *                              KEWR, KORD, KATL, etc.)
 *      startTime   int         the latest date and time to begin retrieving results from 
 *                              (in seconds since 1970), enumerating backwards in time 
 *                              when howMany is non-zero. If specified as zero, then the 
 *                              most recent report available is assumed.
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
 *  result          object      ArrayOfMetarStruct
 */
FlightAware.prototype.MetarEx = function(query, callback) {
    this._request("MetarEx", query, callback)
};

/*
 * Given an airport, return the terminal area forecast, if available.
 *
 * See Taf for a simpler interface.
 *
 * Parameters:
 *  airport	    string	    the ICAO airport ID (e.g., KLAX, KSFO, KIAH, KHOU, KJFK, 
 *                          KEWR, KORD, KATL, etc.)
 *  callback    function    async completion callback
 *
 * Returns:
 *  undefined
 *
 * Async callback:  callback(err, result)
 *  err             object      undefined or error information
 *  result          string      NTaf data
 */
FlightAware.prototype.NTaf = function(airport, callback) {
    var query = { airport : airport };
    this._request("NTaf", query, callback)
};

/*
 * RegisterAlertEndpoint specifies where pushed FlightXML flight alerts.  Calling this 
 * method a second time will overwrite any previously registered endpoint.  
 *
 * The other methods SetAlert, GetAlerts, and DeleteAlert can be used to manage 
 * FlightXML flight alerts.  
 *
 * The "format_type" argument controls how the flight alert is delivered to the 
 * specified address. Currently "format_type" must always be "json/post", although other 
 * formats may be introduced in the future.  When an alert occurs, FlightAware servers 
 * will deliver an HTTP POST to the specified address with the body containing a 
 * JSON-encoded message about the alert and flight.  
 *
 * Returns 1 on success, otherwise an error record is returned.  
 *
 * Parameters:
 *  query
 *  {
 *      address	        string	    URL of endpoint
 *      format_type	    string	    Must be "json/post"
 *  }
 *  callback            function    async completion callback
 *
 * Returns:
 *  undefined
 *
 * Async callback:  callback(err, result)
 *  err             object      undefined or error information
 *  result          int         1 on success
 */
FlightAware.prototype.RegisterAlertEndpoint = function(query, callback) {
    this._request("RegisterAlertEndpoint", query, callback)
};

/*
 * RoutesBetweenAirports returns information about assigned IFR routings between two 
 * airports. For each known routing, the route, number of times that route has been 
 * assigned, and the filed altitude (measured in hundreds of feet or Flight Level) are 
 * returned. Only flights that departed within the last 6 hours and flight plans filed 
 * within the last 3 days are considered.
 *
 * Parameters:
 *  query
 *  {
 *      origin	        string	    the ICAO airport ID (e.g., KLAX, KSFO, KIAH, KHOU, 
 *                                  KJFK, KEWR, KORD, KATL, etc.)
 *      destination	    string	    the ICAO airport ID (e.g., KLAX, KSFO, KIAH, KHOU, 
 *                                  KJFK, KEWR, KORD, KATL, etc.)
 *  }
 *  callback            function    async completion callback
 *
 * Returns:
 *  undefined
 *
 * Async callback:  callback(err, result)
 *  err             object      undefined or error information
 *  result          object      ArrayOfRoutesBetweenAirportsStruct
 */
FlightAware.prototype.RoutesBetweenAirports = function(query, callback) {
    this._request("RoutesBetweenAirports", query, callback)
};

/*
 * RoutesBetweenAirportsEx returns information about assigned IFR routings between two 
 * airports. This is an extended version of RoutesBetweenAirports that allows you to 
 * specify the maximum age of flights to consider. For each known routing, the route, 
 * number of times that route has been assigned, the filed altitude (lowest and highest 
 * among found plans, measured in 100 ft intervals), and the most recent filed departure 
 * date/time are returned.  
 *
 * See RoutesBetweenAirports for a simpler interface.
 *
 * Parameters:
 *  query
 *  {
 *      origin	        string	    the ICAO airport ID (e.g., KLAX, KSFO, KIAH, KHOU, 
 *                                  KJFK, KEWR, KORD, KATL, etc.)
 *      destination	    string	    the ICAO airport ID (e.g., KLAX, KSFO, KIAH, KHOU, 
 *                                  KJFK, KEWR, KORD, KATL, etc.)
 *      howMany	        int	        determines the number of results. Must be a positive 
 *                                  integer value less than or equal to 15, unless 
 *                                  SetMaximumResultSize has been called.
 *      offset	        int	        must be an integer value of the offset row count you 
 *                                  want the search to start at. Most requests should 
 *                                  be 0.
 *      maxDepatureAge	string	    maximum departure age of flights to consider (for 
 *                                  example: "3 days" or "72 hours")
 *      maxFileAge  	string	    maximum filed plan age of flights to consider (for 
 *                                  example: "6 days"). This should generally be longer 
 *                                  than maxDepartureAge.
 *  }
 *  callback            function    async completion callback
 *
 * Returns:
 *  undefined
 *
 * Async callback:  callback(err, result)
 *  err             object      undefined or error information
 *  result          object      ArrayOfRoutesBetweenAirportsExStruct
 */
FlightAware.prototype.RoutesBetweenAirportsEx = function(query, callback) {
    this._request("RoutesBetweenAirportsEx", query, callback)
};

/*
 * Scheduled returns information about scheduled flights (technically, filed IFR flights)
 * for a specified airport and a maximum number of flights to be returned. Scheduled 
 * flights are returned from soonest to furthest in the future to depart. Only flights 
 * that have not actually departed, and have a scheduled departure time between 2 hours 
 * in the past and 24 hours in the future, are considered.  
 *
 * Times returned are seconds since 1970 (UNIX epoch time).
 *
 * See also Arrived, Departed, and Enroute for other airport tracking functionality.
 *
 * Parameters:
 *  query
 *  {
 *      airport	        string	    the ICAO airport ID (e.g., KLAX, KSFO, KIAH, KHOU, 
 *                                  KJFK, KEWR, KORD, KATL, etc.)
 *      howMany	        int	        determines the number of results. Must be a positive 
 *                                  integer value less than or equal to 15, unless 
 *                                  SetMaximumResultSize has been called.
 *      offset	        int	        must be an integer value of the offset row count you 
 *                                  want the search to start at. Most requests should 
 *                                  be 0.
 *      filter	        string	    can be "ga" to show only general aviation traffic, 
 *                                  "airline" to only show airline traffic, or null/empty 
 *                                  to show all raffic.
 *  }
 *  callback            function    async completion callback
 *
 * Returns:
 *  undefined
 *
 * Async callback:  callback(err, result)
 *  err             object      undefined or error information
 *  result          object      ScheduledStruct
 */
FlightAware.prototype.Scheduled = function(query, callback) {
    this._request("Scheduled", query, callback)
};

/*
 * Search performs a query for data on all airborne aircraft to find ones matching the 
 * search query. Query parameters include a latitude/longitude box, aircraft ident with 
 * wildcards, type with wildcards, prefix, suffix, origin airport, destination airport, 
 * origin or destination airport, groundspeed, and altitude. It takes search terms in a 
 * single string comprising "-key value" pairs and returns an array of flight structures.
 * Codeshares and alternate idents are NOT searched when using the -idents clause.  
 *
 * Keys include: 
 *  -prefix STRING
 *  -type STRING
 *  -suffix STRING
 *  -idents STRING
 *  -destination STRING
 *  -origin STRING
 *  -originOrDestination STRING
 *  -aboveAltitude INTEGER
 *  -belowAltitude INTEGER
 *  -aboveGroundspeed INTEGER
 *  -belowGroundspeed INTEGER
 *  -latlong "MINLAT MINLON MAXLAT MAXLON"
 *  -filter {ga|airline}
 *  -inAir {0|1} 
 *
 * To search for all aircraft below ten-thousand feet with a groundspeed over 200 kts: 
 *  -belowAltitude 100 -aboveGroundspeed 200
 *
 * To search for all in-air Boeing 777s: 
 *  -type B77*
 *
 * To search for all aircraft heading to Los Angeles International Airport (LAX) that 
 * are "heavy" aircraft: 
 *  -destination KLAX -prefix H
 *
 * To search for all United Airlines flights in Boeing 737s 
 *  -idents UAL* -type B73*
 *
 * See the SearchBirdseyeInFlight function for additional functionality.
 *
 * Parameters:
 *  query
 *  {
 *      query                       (optional) specify the query string instead of
 *                                  using the parameters map
 *      parameters                  a map of key value pairs that create the query string
 *      {
 *          key1 : value1,          e.g. "type" : "B77*",
 *          key2 : value2,          e.g. "destination" : "KLAX",  
 *          ...
 *      }
 *      howMany	        int	        determines the number of results. Must be a positive 
 *                                  integer value less than or equal to 15, unless 
 *                                  SetMaximumResultSize has been called.
 *      offset	        int	        must be an integer value of the offset row count you 
 *                                  want the search to start at. Most requests should 
 *                                  be 0.
 *  }
 *  callback            function    async completion callback
 *
 * Returns:
 *  undefined
 *
 * Async callback:  callback(err, result)
 *  err             object      undefined or error information
 *  result          object      InFlightStruct
 */
FlightAware.prototype.Search = function(query, callback) {
    var queryString = query.query || '';
    for(var q in query.parameters) {
        var value = query.parameters[q];
        queryString += ' -' + q + ' ' + value;
    }

    query.query = queryString;
    this._request("Search", query, callback)
};

/*
 * SearchBirdseyeInFlight performs a query for all aircraft matching the search query. 
 * Query parameters include a latitude/longitude box, aircraft ident with wildcards, 
 * type with wildcards, prefix, suffix, origin airport, destination airport, origin or 
 * destination airport, groundspeed, and altitude. It takes search terms in a single 
 * string comprising of {operator key value} elements and returns an array of flight 
 * structures. Each search term must be enclosed in curly braces. Multiple search terms 
 * can be combined in an implicit boolean "and" by separating the terms with at least 
 * one space. This function only searches flight data representing approximately the 
 * last 24 hours. Codeshares and alternate idents are NOT searched when matching against 
 * the ident key.  
 *
 * The supported operators include (note that operators take different numbers of 
 * arguments): 
 *
 *  false — results must have the specified boolean key set to a value of false. 
 *      Example: {false inAir}
 *  true — results must have the specified boolean key set to a value of true. 
 *      Example: {true lifeguard}
 *  null — results must have the specified key set to a null value. 
 *      Example: {null waypoints}
 *  notnull — results must have the specified key not set to a null value. 
 *      Example: {notnull aircraftType}
 *  = — results must have a key that exactly matches the specified value. 
 *      Example: {= aircraftType C172}
 *  != — results must have a key that must not match the specified value. 
 *      Example: {!= prefix H}
 *  < — results must have a key that is lexicographically less-than a specified value. 
 *      Example: {< arrivalTime 1276811040}
 *  > — results must have a key that is lexicographically greater-than a specified value.
 *      Example: {> circles 5}
 *  <= — results must have a key that is lexicographically less-than-or-equal-to a 
 *      specified value. 
 *      Example: {<= alt 8000}
 *  >= — results must have a key that is lexicographically greater-than-or-equal-to a 
 *      specified value.
 *  match — results must have a key that matches against a case-insensitive wildcard 
 *      pattern. 
 *      Example: {match ident COA*}
 *  notmatch — results must have a key that does not match against a case-insensitive 
 *      wildcard pattern. 
 *      Example: {notmatch aircraftType B76*}
 *  range — results must have a key that is numerically between the two specified values.
 *      Example: {range alt 8000 20000}
 *  in — results must have a key that exactly matches one of the specified values. 
 *      Example: {in orig {KLAX KBUR KSNA KLGB}}
 *  orig_or_dest — results must have either the origin or destination key exactly match 
 *      one of the specified values. 
 *      Example: {orig_or_dest {KLAX KBUR KSNA KLGB}}
 *  airline — results will only include airline flight if the argument is 1, or will 
 *      only include GA flights if the argument is 0. 
 *      Example: {airline 1}
 *  aircraftType — results must have an aircraftType key that matches one of the 
 *      specified case-insensitive wildcard patterns. 
 *      Example: {aircraftType {B76* B77*}}
 *  ident — results must have an ident key that matches one of the specified 
 *      case-insensitive wildcard patterns. Example: {ident {N123* N456* COA* UAL*}}
 *  ident_or_reg — results must have an ident key or was known to be operated by an 
 *      aircraft registration that matches one of the specified case-insensitive 
 *      wildcard patterns. 
 *      Example: {ident_or_reg {N123* N456* COA* UAL*}}
 *
 *  The supported key names include (note that not all of these key names are returned 
 *  in the result structure, and some have slightly different names): 
 *
 *      actualDepartureTime — Actual time of departure, or 0 if not departed yet. 
 *          UNIX epoch timestamp seconds since 1970
 *      adtEst — true if actualDepartureTime field is estimated.
 *      aircraftType — aircraft type ID (for example: B763)
 *      airways — airways planned to be used by flight (for example: UL344 UJ3 UJ7 
 *          J93 V370 V16)
 *      alt — altitude at last reported position (hundreds of feet or Flight Level)
 *      altChar — altitude change indication (for example: "C" if climbing, "D" if 
 *          descending, and empty if it is level)
 *      altMax — highest altitude reached by flight so far (hundreds of feet or Flight 
 *          Level)
 *      angleCount —
 *      arrivalTime — Actual time of arrival, or 0 if not arrived yet. UNIX epoch 
 *          timestamp seconds since 1970
 *      arrivalTimeEstimated — Estimate time of arrival. UNIX epoch timestamp seconds 
 *          since 1970
 *      arrived — true if the flight has arrived at its destination.
 *      cancelled — true if the flight has been cancelled.
 *      cdt — Controlled Departure Time, set if there is a ground hold on the flight. 
 *          UNIX epoch timestamp seconds since 1970
 *      circles — number of circular flight patterns detected.
 *      clock — Time of last received position. UNIX epoch timestamp seconds since 1970
 *      cta — Controlled Time of Arrival, set if there is a ground hold on the flight. 
 *          UNIX epoch timestamp seconds since 1970
 *      dest — ICAO airport code of destination (for example: KLAX)
 *      distance — distance of the flightplan as calculated from the waypoints or great 
 *          circle (miles)
 *      divertCancellationReceived —
 *      diverted — true if the flight has been diverted to a new destination.
 *      diverting —
 *      edt — Estimated Departure Time. Epoch timestamp seconds since 1970
 *      eta — Estimated Time of Arrival. Epoch timestamp seconds since 1970
 *      fdt — Field Departure Time. UNIX epoch timestamp seconds since 1970
 *      firstPositionTime — Time when first reported position was received, or 0 if no 
 *          position has been received yet. Epoch timestamp seconds since 1970
 *      fixes — intersections and/or VORs along the route (for example: SLS AMERO ARTOM 
 *          VODIR NOTOS ULAPA ACA NUXCO OLULA PERAS ALIPO UPN GDL KEDMA BRISA CUL PERTI 
 *          CEN PPE ALTAR ASUTA JLI RONLD LAADY WYVIL OLDEE RAL PDZ ARNES BASET WELLZ 
 *          CIVET)
 *      fp — unique identifier assigned by FlightAware for this flight, aka faFlightID.
 *      gs — ground speed at last reported position, in kts.
 *      heading — direction of travel at last reported position.
 *      hiLat — highest latitude travelled by flight.
 *      hiLon — highest longitude travelled by flight.
 *      ident — flight identifier or tail number of aircraft.
 *      inAir — true if currently in the air.
 *      lastHeading — direction of travel at last reported position.
 *      lastPositionTime — Time when last reported position was received, or 0 if no 
 *          position has been received yet. Epoch timestamp seconds since 1970.
 *      lat — latitude of last reported position.
 *      lifeguard — true if a "lifeguard" rescue flight.
 *      lon — longitude of last reported position.
 *      lowLat — lowest latitude travelled by flight.
 *      lowLon — lowest longitude travelled by flight.
 *      nPositions — number of reported positions received.
 *      ogta — Original Time of Arrival. UNIX epoch timestamp seconds since 1970
 *      ogtd — Original Time of Departure. UNIX epoch timestamp seconds since 1970
 *      orig — ICAO airport code of origin (for example: KIAH)
 *      originalDest — ICAO airport code of original destination, if the flight has been 
 *          diverted.
 *      physClass — physical class (for example: J is jet)
 *      prefix — aircraft type prefix code (for example: "H" for heavy aircraft).
 *      recvd —
 *      route —
 *      speed — ground speed, in kts.
 *      status —
 *      suffix —
 *      taxi — true if flight is an air taxi
 *      updateType — data source of last position (TP=projected, TO=oceanic, TZ=radar, 
 *          TA=broadcast).
 *      userClass —
 *      waypoints — all of the intersections and VORs comprising the route
 *
 * Parameters:
 *  query
 *  {
 *      query                       search expression
 *      howMany	        int	        determines the number of results. Must be a positive 
 *                                  integer value less than or equal to 15, unless 
 *                                  SetMaximumResultSize has been called.
 *      offset	        int	        must be an integer value of the offset row count you 
 *                                  want the search to start at. Most requests should 
 *                                  be 0.
 *  }
 *  callback            function    async completion callback
 *
 * Returns:
 *  undefined
 *
 * Async callback:  callback(err, result)
 *  err             object      undefined or error information
 *  result          object      InFlightStruct
 */
FlightAware.prototype.SearchBirdseyeInFlight = function(query, callback) {
    this._request("SearchBirdseyeInFlight", query, callback)
};

/*
 * SearchBirdseyePositions performs a query for aircraft flightpath datapoints matching 
 * the search query. This allows you to locate flights that have ever flown within a 
 * specific a latitude/longitude box, groundspeed, and altitude. It takes search terms 
 * in a single string comprising of {operator key value} elements and returns an array 
 * of flight structures. Each search term must be enclosed in curly braces. Multiple 
 * search terms can be combined in an implicit boolean "and" by separating the terms 
 * with at least one space. This function only searches flight data representing 
 * approximately the last 24 hours.  
 *
 * The supported operators include (note that operators take different numbers of 
 * arguments): 
 *
 *      false — results must have the specified boolean key set to a value of false. 
 *          Example: {false preferred}
 *      true — results must have the specified boolean key set to a value of true. 
 *          Example: {true preferred}
 *      null — results must have the specified key set to a null value. 
 *          Example: {null waypoints}
 *      notnull — results must have the specified key not set to a null value. 
 *          Example: {notnull aircraftType}
 *      = — results must have a key that exactly matches the specified value. 
 *          Example: {= fp C172}
 *      != — results must have a key that must not match the specified value. 
 *          Example: {!= prefix H}
 *      < — results must have a key that is lexicographically less-than a specified value.
 *          Example: {< arrivalTime 1276811040}
 *      > — results must have a key that is lexicographically greater-than a specified 
 *          value. 
 *          Example: {> circles 5}
 *      <= — results must have a key that is lexicographically less-than-or-equal-to a 
 *          specified value. 
 *          Example: {<= alt 8000}
 *      >= — results must have a key that is lexicographically greater-than-or-equal-to 
 *          a specified value.
 *      match — results must have a key that matches against a case-insensitive wildcard
 *          pattern. 
 *          Example: {match ident COA*}
 *      notmatch — results must have a key that does not match against a case-insensitive
 *          wildcard pattern. 
 *          Example: {notmatch aircraftType B76*}
 *      range — results must have a key that is numerically between the two specified 
 *          values. 
 *          Example: {range alt 8000 20000}
 *      in — results must have a key that exactly matches one of the specified values. 
 *          Example: {in orig {KLAX KBUR KSNA KLGB}}
 *
 * The supported key names include (note that not all of these key names are returned in 
 * the result structure, and some have slightly different names):
 *
 *      alt — Altitude, measured in hundreds of feet or Flight Level.
 *      altChar — a one-character code indicating the change in altitude.
 *      altMax — Altitude, measured in hundreds of feet or Flight Level.
 *      cid — a three-character cid code
 *      cidfac — a four-character cidfac code
 *      clock — UNIX epoch timestamp seconds since 1970
 *      facility — a four-character facility code
 *      fp — unique identifier assigned by FlightAware for this flight, aka faFlightID.
 *      gs — ground speed, measured in kts.
 *      lat — latitude of the reported position.
 *      lon — longitude of the reported position
 *      preferred — boolean indicator of position quality
 *      recvd — UNIX epoch timestamp seconds since 1970
 *      updateType — source of the last reported position (TP=projected, TO=oceanic, 
 *          TZ=radar, TA=broadcast)
 *
 * Parameters:
 *  query
 *  {
 *      query           string      search expression
 *      uniqueFlights   bool        if true, only one flight position will be returned 
 *                                  per unique faFlightID. if false, all matching flight 
 *                                  positions will be returned
 *      howMany	        int	        determines the number of results. Must be a positive 
 *                                  integer value less than or equal to 15, unless 
 *                                  SetMaximumResultSize has been called.
 *      offset	        int	        must be an integer value of the offset row count you 
 *                                  want the search to start at. Most requests should 
 *                                  be 0.
 *  }
 *  callback            function    async completion callback
 *
 * Returns:
 *  undefined
 *
 * Async callback:  callback(err, result)
 *  err             object      undefined or error information
 *  result          object      ArrayOfTrackExStruct
 */
FlightAware.prototype.SearchBirdseyePositions = function(query, callback) {
    this._request("SearchBirdseyePositions", query, callback)
};

/*
 * SearchCount works like Search but returns a count of matching flights rather than 
 * information about each flight.
 *
 * Parameters:
 *  query
 *  {
 *      query                       (optional) specify the query string instead of
 *                                  using the parameters map
 *      parameters                  a map of key value pairs that create the query string
 *      {
 *          key1 : value1,          e.g. "type" : "B77*",
 *          key2 : value2,          e.g. "destination" : "KLAX",  
 *          ...
 *      }
 *      howMany	        int	        determines the number of results. Must be a positive 
 *                                  integer value less than or equal to 15, unless 
 *                                  SetMaximumResultSize has been called.
 *      offset	        int	        must be an integer value of the offset row count you 
 *                                  want the search to start at. Most requests should 
 *                                  be 0.
 *  }
 *  callback            function    async completion callback
 *
 * Returns:
 *  undefined
 *
 * Async callback:  callback(err, result)
 *  err             object      undefined or error information
 *  result          int         number of results that would be returned by Search
 */
FlightAware.prototype.SearchCount = function(query, callback) {
    var queryString = query.query || '';
    for(var q in query.parameters) {
        var value = query.parameters[q];
        queryString += ' -' + q + ' ' + value;
    }

    query.query = queryString;
    this._request("SearchCount", query, callback)
};


module.exports = FlightAware;
