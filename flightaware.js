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
 *  result          int         FlightInfoExStruct
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
 *  result          int         FlightAlertListing
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
 *      ident	        string  requested tail number
 *      departureTime   int     time and date of the desired flight, UNIX epoch seconds 
 *                              since 1970
 *  }
 *  callback        function    async completion callback
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
 *  result          string      ArrayOfTrackStruct
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
 *  result          string      ArrayOfTrackStruct
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
 *  result          string      FlightExStruct
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
 *  result          string      InFlightAircraftStruct
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
 *  lat1            float       Latitude of point 1
 *  lon1            float       Longitude of point 1
 *  lat2            float       Latitude of point 2
 *  lon2            float       Longitude of point 2
 *  callback        function    async completion callback
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
 *  lat1            float       Latitude of point 1
 *  lon1            float       Longitude of point 1
 *  lat2            float       Latitude of point 2
 *  lon2            float       Longitude of point 2
 *  callback        function    async completion callback
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
 *  ident           string      requested tail number
 *  mapHeight       int         height of requested image, in pixels
 *  mapWidth        int         width of requested image, in pixels
 *  callback        function    async completion callback
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
 *  faFlightID              string      unique identifier assigned by FlightAware for the 
 *                                      desired flight (or use "ident@departureTime")
 *  mapHeight               int         height of requested image, in pixels
 *  mapWidth                int         width of requested image, in pixels
 *  layer_on                string()    optional list of map layer names to enable
 *  layer_off               string()    optional list of map layer names to disable
 *  show_data_blocks        bool        if true, a textual caption of the ident, type, 
 *                                      heading, altitude, origin, and destination will
 *                                      be displayed below the flight position.
 *  show_airports           bool        if true, show the origin/destination airports as 
 *                                      dots with textual labels.
 *  airports_expand_view    bool        if true, force zoom area to ensure 
 *                                      origin/destination airports are visible. 
 *                                      show_airports must also be true to use this 
 *                                      feature.
 * latlon_box               float()     optionally specify the zoom area. if specified, 
 *                                      should be a list of 4 elements (hilat, lowlon, 
 *                                      lowlat, hilon), otherwise an automatic zoom will 
 *                                      be used.
 *  callback                function    async completion callback
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


module.exports = FlightAware;
