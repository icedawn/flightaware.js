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

    def flight_info(self, ident, howMany=MAX_RECORD_LENGTH):
        """
        FlightInfo returns information about flights for a specific tail number (e.g., N12345), or ICAO airline code with flight number (e.g., SWA2558).

        The howMany argument specifies the maximum number of flights to be returned. Flight information will be returned from newest to oldest.
        The oldest flights searched by this function are about 2 weeks in the past.

        When specifying an airline with flight number, wither an ICAO or IATA code may be used to designate the airline, however andCodeshares and alternate idents are automatically searched.

        Times are in integer seconds since 1970 (UNIX epoch time), except for estimated time enroute, which is in hours and minutes.

        See FlightInfoEx for a more advanced interface.

        ident	string	requested tail number, or airline with flight number
        howMany	int	maximum number of past flights to obtain. Must be a positive integer value less than or equal to 15, unless SetMaximumResultSize has been called.
        """
        data = { "ident": ident, "howMany": howMany }
        return self._request("FlightInfo", data)

    def flight_info_ex(self, ident, howMany=MAX_RECORD_LENGTH, offset=0):
        """
        FlightInfoEx returns information about flights for a specific tail number (e.g., N12345), or an ident (typically an ICAO airline with flight number, e.g., SWA2558),
        or a FlightAware-assigned unique flight identifier (e.g. faFlightID returned by another FlightXML function).

        The howMany argument specifies the maximum number of flights to be returned. When a tail number or ident is specified and multiple flights
        are available, the results will be returned from newest to oldest. The oldest flights searched by this function are about 2 weeks in the past.
        Codeshares and alternate idents are automatically searched. When a FlightAware-assigned unique flight identifier is supplied, at most a single result will be returned.

        Times are in integer seconds since 1970 (UNIX epoch time), except for estimated time enroute, which is in hours and minutes.

        See FlightInfo for a simpler interface.
        """
        data = {"ident": ident, "howMany": howMany, "offset": offset}
        return self._request("FlightInfoEx", data)

    def get_alerts(self):
        """
        GetAlerts retrieves all of the FlightXML flight alerts that are
        currently scheduled for the user.

        The other methods SetAlert, DeleteAlert, and RegisterAlertEndpoint can
        be used to manage FlightXML flight alerts.

        Note: If other alerts have been defined by the user on the FlightAware
        website or mobile app, they will also be included in the returned
        listing.

        Inputs
            No inputs.
        Returns
            Type                Description
            FlightAlertListing  all defined alerts by the user
        """
        return self._request("GetAlerts", {})


    def get_flight_id(self, ident, departure_datetime):
        """
        GetFlightID looks up the "faFlightID" for a given ident and departure time. This value is a unique identifier assigned by
        FlightAware as a way to permanently identify a flight. The specified departure time must exactly match either the actual
        or scheduled departure time of the flight. The departureTime is specified as integer seconds since 1970 (UNIX epoch time).

        If more than one flight corresponds to the specified ident and departure time, then only the first matching faFlightID
        is returned. Codeshares and alternate idents are automatically searched.


        ident          string   requested tail number
        departureTime  int      time and date of the desired flight, UNIX epoch seconds since 1970
        """

        data = { "ident": ident, "departureTime": to_unix_timestamp(departure_datetime) }
        return self._request("GetFlightID", data)

    def get_historical_track(self, faFlightID):
        """
        GetHistoricalTrack looks up a past flight's track log by its unique identifier. To obtain the faFlightID, you can use a function such as GetFlightID, FlightInfoEx, or InFlightInfo.

        This function returns an array of positions, with each including the timestamp, longitude, latitude, groundspeed, altitude, altitudestatus, updatetype, and altitudechange. Altitude is in hundreds of feet or Flight Level where appropriate, see our FAQ about flight levels. Also included is altitude status, update type, and altitude change.

        Altitude status is 'C' when the flight is more than 200 feet away from its ATC-assigned altitude. (For example, the aircraft is transitioning to its assigned altitude.) Altitude change is 'C' if the aircraft is climbing (compared to the previous position reported), 'D' for descending, and empty if it is level. This happens for VFR flights with flight following, among other things. Timestamp is integer seconds since 1970 (UNIX epoch time).

        Use the GetLastTrack function to look up just the most recent flight rather than a specific historical one.
        """
        data = { "faFlightID" : faFlightID }
        return self._request("GetHistoricalTrack", data)

    def get_last_track(self, ident):
        """
        GetLastTrack looks up a flight's track log by specific tail number (e.g., N12345) or ICAO airline and flight number (e.g., SWA2558). It returns the track log from the current IFR flight or, if the aircraft is not airborne, the most recent IFR flight. It returns an array of positions, with each including the timestamp, longitude, latitude, groundspeed, altitude, altitudestatus, updatetype, and altitudechange. Altitude is in hundreds of feet or Flight Level where appropriate, see our FAQ about flight levels. Also included altitude status, update type, and altitude change.
        Altitude status is 'C' when the flight is more than 200 feet away from its ATC-assigned altitude. (For example, the aircraft is transitioning to its assigned altitude.) Altitude change is 'C' if the aircraft is climbing (compared to the previous position reported), 'D' for descending, and empty if it is level. This happens for VFR flights with flight following, among other things. Timestamp is integer seconds since 1970 (UNIX epoch time).
        This function only returns tracks for recent flights within approximately the last 24 hours. Use the GetHistoricalTrack function to look up a specific past flight rather than just the most recent one. Codeshares and alternate idents are automatically searched.
        """
        data = { "ident" : ident }
        return self._request("GetLastTrack", data)

    def inbound_flight_info(self, faFlightID):
        """
        InboundFlightInfo returns information about the flight being served by the same aircraft that will service a future flight. To obtain the faFlightID, you can use a function such as GetFlightID, FlightInfoEx, or InFlightInfo.

        The inbound flight can only be determined with accuracy for some commercial airlines. If the inbound flight cannot be determined, an error will be returned.

        Times are in integer seconds since 1970 (UNIX epoch time), except for estimated time enroute, which is in hours and minutes.
        """
        data = { "faFlightID" : faFlightID }
        return self._request("InboundFlightInfo", data)


    def in_flight_info(self, ident):
        """
        InFlightInfo looks up a specific tail number (e.g., N12345) or ICAO airline and flight number (e.g., SWA2558) and returns current position/direction/speed information. It is only useful for currently airborne flights within approximately the last 24 hours. Codeshares and alternate idents are automatically searched.
        """
        data = {"ident" : ident}
        return self._request("InFlightInfo", data)

    def lat_longs_to_distance(self, lat1, lon1, lat2, lon2):
        """
        Given two latitudes and longitudes, lat1 lon1 lat2 and lon2, respectively, determine the great circle distance between those positions in miles. The returned distance is rounded to the nearest whole mile.
        """
        data = { "lat1" : lat1, "lon1" : lon1, "lat2" : lat2, "lon2" : lon2 }
        return self._request("LatLongsToDistance", data)

    def lat_longs_to_heading(self, lat1, lon1, lat2, lon2):
        """
        Given two latitudes and longitudes, lat1 lon1 lat2 and lon2, respectively, calculate and return the initial compass heading (where 360 is North) from position one to position two. Quite accurate for relatively short distances but since it assumes the earth is a sphere rather than on irregular oblate sphereoid may be inaccurate for flights around a good chunk of the world, etc.
        """
        data = { "lat1" : lat1, "lon1" : lon1, "lat2" : lat2, "lon2" : lon2 }
        return self._request("LatLongsToHeading", data)

    def map_flight(self, ident, mapHeight, mapWidth):
        """
        This function will return a base64 encoded GIF or PNG image (with the height and width as specified in pixels) of the current flight of a specified ident. If the aircraft is not currently in the air, then a blank image may be returned. Codeshares and alternate idents are automatically searched.

        See MapFlightEx for a more advanced interface with historical flight capabilities.
        """
        data = { "ident" : ident, "mapHeight" : mapHeight, "mapWidth" : mapWidth }
        return self._request("MapFlight", data)

    def map_flight_ex(self, faFlightID, mapHeight, mapWidth, layer_on, layer_off, show_data_blocks, show_airports, airports_expand_view, latlon_box):
        """
        This function will return a base64 encoded GIF or PNG image (with the height and width as specified in pixels) of a specific flight. The flight may be a current or historical flight, but it must be specified using the unique FlightAware-assigned identifier for the desired flight. To obtain the faFlightID, you can use a function such as GetFlightID, FlightInfoEx, or InFlightInfo.

        The layer_on and layer_off arguments are specify what map features to include or exclude. The available layers and its default mode is shown below:

        "US Cities" (Default: off)
        "european country boundaries" (Default: off)
        "asia country boundaries" (Default: off)
        "country boundaries" (Default: on)
        "US state boundaries" (Default: on)
        "water" (Default: on)
        "US urban areas" (Default: off)
        "US major roads" (Default: on)
        "radar" (Default: on)
        "track" (Default: on)
        "flights" (Default: on)
        "major airports" (Default: on)
        "airports" (Default: on)
        See MapFlight for a simpler interface.
        """
        data = { "faFlightID" : faFlightID, "mapHeight" : mapHeight, "mapWidth" : mapWidth, "layer_on" : layer_on, 
            "layer_off" : layer_off, "show_data_blocks" : show_data_blocks, "show_airports" : show_airports, 
            "airports_expand_view" : airports_expand_view, "latlon_box" : latlon_box, }
        return self._request("MapFlightEx", data)

    def metar(self, airport):
        """
        Given an airport, return the current raw METAR weather info. If no reports are available at the requested airport
        but are for a nearby airport, then the report from that airport may be returned instead.

        Use the MetarEx function for more functionality, including access to historical weather and parsed.
        airport	string	the ICAO airport ID (e.g., KLAX, KSFO, KIAH, KHOU, KJFK, KEWR, KORD, KATL, etc.)
        """
        data = {"airport": airport}
        return self._request("Metar", data)

    def metar_ex(self, airport):
        """
        Given an airport, return the METAR weather info as parsed, human-readable, and raw formats. If no reports are available
        at the requested airport but are for a nearby airport, then the reports from that airport may be returned instead.
        If a value greater than 1 is specified for howMany then multiple past reports will be returned, in order of increasing
        age. Historical data is generally only available for the last 7 days.

        Use the Metar function for a simpler interface to access just the most recent raw report.
        airport	string	the ICAO airport ID (e.g., KLAX, KSFO, KIAH, KHOU, KJFK, KEWR, KORD, KATL, etc.)
        """
        data = {"airport": airport}
        return self._request("MetarEx", data)

    def ntaf(self, airport):
        """
        Given an airport, return the terminal area forecast, if available.
        See Taf for a simpler interface.
        airport	string	the ICAO airport ID (e.g., KLAX, KSFO, KIAH, KHOU, KJFK, KEWR, KORD, KATL, etc.)
        """
        data = {"airport": airport}
        return self._request("NTaf", data)

    def register_alert_endpoint(self, address, format_type="json/post"):
        """
        RegisterAlertEndpoint specifies where pushed FlightXML flight alerts.
        Calling this method a second time will overwrite any previously
        registered endpoint.

        The other methods SetAlert, GetAlerts, and DeleteAlert can be used to
        manage FlightXML flight alerts.

        The "format_type" argument controls how the flight alert is delivered
        to the specified address. Currently "format_type" must always be
        "json/post", although other formats may be introduced in the future.
        When an alert occurs, FlightAware servers will deliver an HTTP POST to
        the specified address with the body containing a JSON-encoded message
        about the alert and flight.

        Returns 1 on success, otherwise an error record is returned.

        Inputs

        Name    Type    Description
        address string  URL of endpoint
        format_type string  Must be "json/post"
        Returns

        Type    Description
        int     returns 1 on success
        """
        data = { "address" : address, "format_type" : format_type}
        return self._request("RegisterAlertEndpoint", data)

    def routes_between_airports(self, origin, destination):
        """
        RoutesBetweenAirports returns information about assigned IFR routings between two airports. For each known routing, the route, number of times that route has been assigned, and the filed altitude (measured in hundreds of feet or Flight Level) are returned. Only flights that departed within the last 6 hours and flight plans filed within the last 3 days are considered.
        """
        data = { "origin" : origin, "destination" : destination }
        return self._request("RoutesBetweenAirports", data)

    def routes_between_airports_ex(self, origin, destination, howMany=MAX_RECORD_LENGTH, offset=0, maxDepartureAge="3 days", maxFileAge="6 days"):
        """
        RoutesBetweenAirportsEx returns information about assigned IFR routings between two airports. This is an extended version of RoutesBetweenAirports that allows you to specify the maximum age of flights to consider. For each known routing, the route, number of times that route has been assigned, the filed altitude (lowest and highest among found plans, measured in 100 ft intervals), and the most recent filed departure date/time are returned.

        See RoutesBetweenAirports for a simpler interface.
        """
        data = { "origin" : origin, "destination" : destination, "howMany" : howMany, "offset" : offset, "maxDepartureAge" : maxDepartureAge, "maxFileAge" : maxFileAge }
        return self._request("RoutesBetweenAirportsEx", data)

    def scheduled(self, airport, howMany=MAX_RECORD_LENGTH, filter=TrafficFilter.ALL, offset=0):
        """
        Scheduled returns information about scheduled flights (technically,
        filed IFR flights) for a specified airport and a maximum number of
        flights to be returned. Scheduled flights are returned from soonest to
        furthest in the future to depart. Only flights that have not actually
        departed, and have a scheduled departure time between 2 hours in the
        past and 24 hours in the future, are considered.

        Times returned are seconds since 1970 (UNIX epoch time).

        See also Arrived, Departed, and Enroute for other airport tracking
        functionality.


        airport string  the ICAO airport ID (e.g., KLAX, KSFO, KIAH, KHOU, KJFK, KEWR, KORD, KATL, etc.)

        howMany int determines the number of results. Must be a positive integer value less than or equal to 15, unless SetMaximumResultSize has been called.

        filter  string  can be "ga" to show only general aviation traffic, "airline" to only show airline traffic, or null/empty to show all traffic.

        offset  int must be an integer value of the offset row count you want the search to start at. Most requests should be 0.
        """
        data = {"airport": airport, "howMany": howMany, "filter": filter, "offset": offset}
        return self._request("Scheduled", data)

    def search(self, parameters={}, howMany=MAX_RECORD_LENGTH, offset=0):
        """
        Search performs a query for data on all airborne aircraft to find ones
        matching the search query. Query parameters include a
        latitude/longitude box, aircraft ident with wildcards, type with
        wildcards, prefix, suffix, origin airport, destination airport, origin
        or destination airport, groundspeed, and altitude. It takes search
        terms in a single string comprising "-key value" pairs and returns an
        array of flight structures. Codeshares and alternate idents are NOT
        searched when using the -idents clause.

        Keys include:

        -prefix STRING
        -type STRING
        -suffix STRING
        -idents STRING
        -destination STRING
        -origin STRING
        -originOrDestination STRING
        -aboveAltitude INTEGER
        -belowAltitude INTEGER
        -aboveGroundspeed INTEGER
        -belowGroundspeed INTEGER
        -latlong "MINLAT MINLON MAXLAT MAXLON"
        -filter {ga|airline}
        -inAir {0|1}

        To search for all aircraft below ten-thousand feet with a groundspeed
        over 200 kts:

        -belowAltitude 100 -aboveGroundspeed 200
        To search for all in-air Boeing 777s:

        -type B77*
        To search for all aircraft heading to Los Angeles International Airport
        (LAX) that are "heavy" aircraft:

        -destination LAX -prefix H
        To search for all United Airlines flights in Boeing 737s

        -idents UAL* -type B73*
        See the SearchBirdseyeInFlight function for additional functionality.


        query   string  search expression

        howMany int maximum number of flights to obtain. Must be a positive
        integer value less than or equal to 15, unless SetMaximumResultSize has
        been called.

        offset  int must be an integer value of the offset row count you want
        the search to start at. Most requests should be 0.
        """
        query = ""
        for key, value in parameters.items():
            query += "-%s %s " % (key, value)
        data = { "query" : query, "howMany" : howMany, "offset" : offset}
        return self._request("Search", data)

    def search_birdseye_in_flight(self, query, howMany=MAX_RECORD_LENGTH, offset=0):
        """
        SearchBirdseyeInFlight performs a query for all aircraft matching the search query. Query parameters include a latitude/longitude box, aircraft ident with wildcards, type with wildcards, prefix, suffix, origin airport, destination airport, origin or destination airport, groundspeed, and altitude. It takes search terms in a single string comprising of {operator key value} elements and returns an array of flight structures. Each search term must be enclosed in curly braces. Multiple search terms can be combined in an implicit boolean "and" by separating the terms with at least one space. This function only searches flight data representing approximately the last 24 hours. Codeshares and alternate idents are NOT searched when matching against the ident key.

        The supported operators include (note that operators take different numbers of arguments):

        false — results must have the specified boolean key set to a value of false. Example: {false inAir}
        true — results must have the specified boolean key set to a value of true. Example: {true lifeguard}
        null — results must have the specified key set to a null value. Example: {null waypoints}
        notnull — results must have the specified key not set to a null value. Example: {notnull aircraftType}
        = — results must have a key that exactly matches the specified value. Example: {= aircraftType C172}
        != — results must have a key that must not match the specified value. Example: {!= prefix H}
        < — results must have a key that is lexicographically less-than a specified value. Example: {< arrivalTime 1276811040}
        > — results must have a key that is lexicographically greater-than a specified value. Example: {> circles 5}
        <= — results must have a key that is lexicographically less-than-or-equal-to a specified value. Example: {<= alt 8000}
        >= — results must have a key that is lexicographically greater-than-or-equal-to a specified value.
        match — results must have a key that matches against a case-insensitive wildcard pattern. Example: {match ident COA*}
        notmatch — results must have a key that does not match against a case-insensitive wildcard pattern. Example: {notmatch aircraftType B76*}
        range — results must have a key that is numerically between the two specified values. Example: {range alt 8000 20000}
        in — results must have a key that exactly matches one of the specified values. Example: {in orig {KLAX KBUR KSNA KLGB}}
        orig_or_dest — results must have either the origin or destination key exactly match one of the specified values. Example: {orig_or_dest {KLAX KBUR KSNA KLGB}}
        airline — results will only include airline flight if the argument is 1, or will only include GA flights if the argument is 0. Example: {airline 1}
        aircraftType — results must have an aircraftType key that matches one of the specified case-insensitive wildcard patterns. Example: {aircraftType {B76* B77*}}
        ident — results must have an ident key that matches one of the specified case-insensitive wildcard patterns. Example: {ident {N123* N456* COA* UAL*}}
        ident_or_reg — results must have an ident key or was known to be operated by an aircraft registration that matches one of the specified case-insensitive wildcard patterns. Example: {ident_or_reg {N123* N456* COA* UAL*}}
        The supported key names include (note that not all of these key names are returned in the result structure, and some have slightly different names):

        actualDepartureTime — Actual time of departure, or 0 if not departed yet. UNIX epoch timestamp seconds since 1970
        adtEst — true if actualDepartureTime field is estimated.
        aircraftType — aircraft type ID (for example: B763)
        airways — airways planned to be used by flight (for example: UL344 UJ3 UJ7 J93 V370 V16)
        alt — altitude at last reported position (hundreds of feet or Flight Level)
        altChar — altitude change indication (for example: "C" if climbing, "D" if descending, and empty if it is level)
        altMax — highest altitude reached by flight so far (hundreds of feet or Flight Level)
        angleCount —
        arrivalTime — Actual time of arrival, or 0 if not arrived yet. UNIX epoch timestamp seconds since 1970
        arrivalTimeEstimated — Estimate time of arrival. UNIX epoch timestamp seconds since 1970
        arrived — true if the flight has arrived at its destination.
        cancelled — true if the flight has been cancelled.
        cdt — Controlled Departure Time, set if there is a ground hold on the flight. UNIX epoch timestamp seconds since 1970
        circles — number of circular flight patterns detected.
        clock — Time of last received position. UNIX epoch timestamp seconds since 1970
        cta — Controlled Time of Arrival, set if there is a ground hold on the flight. UNIX epoch timestamp seconds since 1970
        dest — ICAO airport code of destination (for example: KLAX)
        distance — distance of the flightplan as calculated from the waypoints or great circle (miles)
        divertCancellationReceived —
        diverted — true if the flight has been diverted to a new destination.
        diverting —
        edt — Estimated Departure Time. Epoch timestamp seconds since 1970
        eta — Estimated Time of Arrival. Epoch timestamp seconds since 1970
        fdt — Field Departure Time. UNIX epoch timestamp seconds since 1970
        firstPositionTime — Time when first reported position was received, or 0 if no position has been received yet. Epoch timestamp seconds since 1970
        fixes — intersections and/or VORs along the route (for example: SLS AMERO ARTOM VODIR NOTOS ULAPA ACA NUXCO OLULA PERAS ALIPO UPN GDL KEDMA BRISA CUL PERTI CEN PPE ALTAR ASUTA JLI RONLD LAADY WYVIL OLDEE RAL PDZ ARNES BASET WELLZ CIVET)
        fp — unique identifier assigned by FlightAware for this flight, aka faFlightID.
        gs — ground speed at last reported position, in kts.
        heading — direction of travel at last reported position.
        hiLat — highest latitude travelled by flight.
        hiLon — highest longitude travelled by flight.
        ident — flight identifier or tail number of aircraft.
        inAir — true if currently in the air.
        lastHeading — direction of travel at last reported position.
        lastPositionTime — Time when last reported position was received, or 0 if no position has been received yet. Epoch timestamp seconds since 1970.
        lat — latitude of last reported position.
        lifeguard — true if a "lifeguard" rescue flight.
        lon — longitude of last reported position.
        lowLat — lowest latitude travelled by flight.
        lowLon — lowest longitude travelled by flight.
        nPositions — number of reported positions received.
        ogta — Original Time of Arrival. UNIX epoch timestamp seconds since 1970
        ogtd — Original Time of Departure. UNIX epoch timestamp seconds since 1970
        orig — ICAO airport code of origin (for example: KIAH)
        originalDest — ICAO airport code of original destination, if the flight has been diverted.
        physClass — physical class (for example: J is jet)
        prefix — aircraft type prefix code (for example: "H" for heavy aircraft).
        recvd —
        route —
        speed — ground speed, in kts.
        status —
        suffix —
        taxi — true if flight is an air taxi
        updateType — data source of last position (TP=projected, TO=oceanic, TZ=radar, TA=broadcast).
        userClass —
        waypoints — all of the intersections and VORs comprising the route
        """
        data = { "query" : query, "howMany" : howMany, "offset" : offset}
        return self._request("SearchBirdseyeInFlight", data)

    def search_birdseye_positions(self, query, uniqueFlights=False, howMany=MAX_RECORD_LENGTH, offset=0):
        """
        SearchBirdseyePositions performs a query for aircraft flightpath datapoints matching the search query. This allows you to locate flights that have ever flown within a specific a latitude/longitude box, groundspeed, and altitude. It takes search terms in a single string comprising of {operator key value} elements and returns an array of flight structures. Each search term must be enclosed in curly braces. Multiple search terms can be combined in an implicit boolean "and" by separating the terms with at least one space. This function only searches flight data representing approximately the last 24 hours.

        The supported operators include (note that operators take different numbers of arguments):

        false — results must have the specified boolean key set to a value of false. Example: {false preferred}
        true — results must have the specified boolean key set to a value of true. Example: {true preferred}
        null — results must have the specified key set to a null value. Example: {null waypoints}
        notnull — results must have the specified key not set to a null value. Example: {notnull aircraftType}
        = — results must have a key that exactly matches the specified value. Example: {= fp C172}
        != — results must have a key that must not match the specified value. Example: {!= prefix H}
        < — results must have a key that is lexicographically less-than a specified value. Example: {< arrivalTime 1276811040}
        > — results must have a key that is lexicographically greater-than a specified value. Example: {> circles 5}
        <= — results must have a key that is lexicographically less-than-or-equal-to a specified value. Example: {<= alt 8000}
        >= — results must have a key that is lexicographically greater-than-or-equal-to a specified value.
        match — results must have a key that matches against a case-insensitive wildcard pattern. Example: {match ident COA*}
        notmatch — results must have a key that does not match against a case-insensitive wildcard pattern. Example: {notmatch aircraftType B76*}
        range — results must have a key that is numerically between the two specified values. Example: {range alt 8000 20000}
        in — results must have a key that exactly matches one of the specified values. Example: {in orig {KLAX KBUR KSNA KLGB}}
        The supported key names include (note that not all of these key names are returned in the result structure, and some have slightly different names):

        alt — Altitude, measured in hundreds of feet or Flight Level.
        altChar — a one-character code indicating the change in altitude.
        altMax — Altitude, measured in hundreds of feet or Flight Level.
        cid — a three-character cid code
        cidfac — a four-character cidfac code
        clock — UNIX epoch timestamp seconds since 1970
        facility — a four-character facility code
        fp — unique identifier assigned by FlightAware for this flight, aka faFlightID.
        gs — ground speed, measured in kts.
        lat — latitude of the reported position.
        lon — longitude of the reported position
        preferred — boolean indicator of position quality
        recvd — UNIX epoch timestamp seconds since 1970
        updateType — source of the last reported position (TP=projected, TO=oceanic, TZ=radar, TA=broadcast)
        """
        unique = 'true' if uniqueFlights else 'false'
        data = { "query" : query, "uniqueFlights" : unique, "howMany" : howMany, "offset" : offset}
        return self._request("SearchBirdseyePositions", data)

    def search_count(self, parameters={}):
        """
        SearchCount works like Search but returns a count of matching flights rather than information about each flight.
        """
        query = ""
        for key, value in parameters.items():
            query += "-%s %s " % (key, value)
        data = { "query" : query }
        return self._request("SearchCount", data)

    def set_alert(self, alert_id=0, ident=None, origin=None, destination=None,
        aircrafttype=None, date_start=None, date_end=None, channels=[],
        enabled=True, max_weekly=1000):
        """
        SetAlert creates or updates a FlightXML flight alert. When the alert is
        triggered, a callback mechanism will be used to notify the address
        specified by RegisterAlertEndpoint. Each alert that is triggered is
        charged at the rate of one "class 2" FlightXML query.

        If the "alert_id" argument is specified, then an existing alert is
        updated to the new values specified, otherwise a 0 or blank alert_id
        will cause a new alert to be created.

        As a special case, if "alert_id" is specified as -1 and "ident" is not
        blank, update the most recently modified alert for the same "ident" to
        the arguments specified. If no existing alert for that "ident" exists,
        create it.

        For a single day alert, specify date_start and date_end with the same
        value. For a recurring alert, specify both date_start as 0 and date_end
        as 0.

        The "channel" argument is a Tcl-style string list that specifies the
        target channel ID and the triggering event types. At this time, the
        channel ID should always be specified as 16. Supported event types are:
        e_filed e_departure e_arrival e_diverted e_cancelled. For example this
        specifies a FlightXML Push channel with several flight statuses:
        "{16 e_filed e_departure e_arrival e_diverted e_cancelled}"

        The "max_weekly" argument is used to prevent the an alert from being
        created that might generate more alerts than desired. This check is
        only done at alert creation time based on historical trends for the
        filter selection, and is not an enforcement of alerts actually
        delivered.

        Returns a non-zero number (the alert_id that was added or updated) on
        success, otherwise an exception is raised. An error string beginning
        with "OVERLIMIT" means the user has exceeded the maximum number of
        enabled alerts permitted by their account type; consider disabling or
        deleting some alerts, or request an account upgrade. An error string
        beginning with "FLOODWARN" means that the new alert was rejected
        because it was predicted to exceed the number of alerts specified by
        the "max_weekly" argument.

        Inputs

        Name        Type    Description
        alert_id    int     alert_id of an existing alert to update.
                            specify 0 or "" to create a new alert.
                            specify -1 to upsert an alert.
                            otherwise an existing alert id.
        ident       string  optional ident or faFlightID of flight
        origin      string  optional origin airport code
        destination string  optional destination airport code
        aircrafttype    string  optional aircraft type
        date_start  int     optional starting date of alert (in epoch seconds,
                            will be rounded to whole day)
        date_end    int     optional ending date of alert (in epoch seconds,
                            will be rounded to whole day)
        channels    string  list of channels and event types (see description
                            for syntax)
        enabled     boolean whether the alert should be enabled or disabled (if
                            missing, default is true)
        max_weekly  int     reject the new alert if the estimated number of
                            alerts per week exceeds this amount (recommended
                            default 1000)

        Returns

        Type    Description
        int returns non-zero on success
        """
        data = {
            "alert_id": alert_id,
            "enabled": enabled,
            "max_weekly": max_weekly
        }
        if ident is not None:
            data["ident"] = ident
        if origin is not None:
            data["origin"] = origin
        if destination is not None:
            data["destination"] = destination
        if aircrafttype is not None:
            data["aircrafttype"] = aircrafttype
        if date_start is not None:
            data["date_start"] = date_start
        if date_end is not None:
            data["date_end"] = date_end
        if len(channels) > 0:
            data["channels"] = channels
        if enabled is not None:
            data["enabled"] = enabled

        return self._request("SetAlert", data)

    def set_maximum_result_size(self, max_size):
        """
        SetMaximumResultSize modifies the maximum result count returned by other FlightXML methods. Many FlightXML methods that return lists limit the number of results to 15 records for performance reasons, even if you specify a larger number to its "howMany" argument. Using this method, you can raise the limit allowed for the "howMany" argument for all subsequent FlightXML methods invoked using your account. Once invoked, the last specified max_size is remembered for your account until the next call to SetMaximumResultSize; it is not necessary to call this function repeatedly.

        Any request that has a "howMany" argument and returns more than 15 records will be billed at a rate equivalent to the actual number of results returned divided by 15, rounded up. For example, if you call SetMaximumResultSize with a max_size of 100, then call FlightInfo with howMany of 45, but it only returns 35 records, you will be charged the equivalent of calling FlightInfo a total of 3 times, or 1+int(35/15).
        """
        data = { "max_size" : max_size }
        return self._request("SetMaximumResultSize", data)

    def taf(self, airport):
        """
        Given an airport, return the terminal area forecast, if available.
        See NTaf for a more advanced interface.
        airport	string	the ICAO airport ID (e.g., KLAX, KSFO, KIAH, KHOU, KJFK, KEWR, KORD, KATL, etc.)
        """
        data = { "airport" : airport }
        return self._request("Taf", data)

    def tail_owner(self, ident):
        """
        TailOwner returns information about an the owner of an aircraft, given a flight number or N-number. Data returned
        includes owner's name, location (typically city and state), and website, if any. Codeshares and alternate idents are automatically searched.

        ident	string	requested tail number
        """
        data = {"ident": ident}
        return self._request("TailOwner", data)

    def zipcode_info(self, zipcode):
        """
        ZipcodeInfo returns information about a five-digit zipcode. Of particular importance is latitude and longitude.

        zipcode	string	a five-digit U.S. Postal Service zipcode.
        """
        data = {"zipcode": zipcode}
        return self._request("ZipcodeInfo", data)
        */


module.exports = FlightAware;
