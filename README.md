# flightaware.js - Node.js RESTful API for FlightAware.com

[![Build Status][travis-image]][travis-url]
[![NPM Version][npm-image]][npm-url]
[![Coverage][coveralls-image]][coveralls-url]

This is a Javascript/Node.js based wrapper which simplifies communication with the FlightAware.com RESTful APIs.  Documentation for the APIs can be found at:  http://flightaware.com/commercial/flightxml/explorer

In order to use these APIs, you'll need to be a commercial subscriber to the FlightAware.com service, have a user name, and an API key.

## FlightAware.com API access
In order to use the flightaware.js module, you'll need to have FlightAware username and api_key.  You can get these from http://flightaware.com/commercial/flightxml.  Note, that you'll need to sign up for the service.  There is a free tier of service, but not all of the APIs are supported and the unit tests, described below, may fail.

You can find an example of how to use flightaware.js with AngularJS/node/express/bootstrap [here](https://github.com/icedawn/angular-flightaware.js).

![AngularJS/flightaware.js example screenshot](https://raw.githubusercontent.com/icedawn/angular-flightaware.js/master/screenshots/arrival-screenshot.png?raw=true "AngularJS/flightaware.js example screenshot")

## Installation
Install this module using npm.
```shell
npm install flightaware.js
```

## Unit testing
In order to unit test the flightaware.js module, you will need to check out the flightaware.js sources and create a file called ```config.js``` in the ```flightaware.js``` source tree.

### Get the flightaware.js sources
```shell
git clone https://github.com/icedawn/flightaware.js
cd flightaware.js
```

### Setting up config.js for unit testing
```shell
cat > config.js << EOF
module.exports = {
    username : 'your-flightaware-username',
    apiKey :   'your-flightaware-api-key'
};
EOF
```

### Running the unit tests
```shell
node test.js
```

[npm-url]: https://www.npmjs.com/package/flightaware.js
[npm-image]: https://img.shields.io/npm/v/flightaware.js.svg?style=flat
[travis-url]: https://travis-ci.org/fdesjardins/flightaware.js
[travis-image]: https://img.shields.io/travis/fdesjardins/flightaware.js.svg?style=flat
[coveralls-url]: https://coveralls.io/r/fdesjardins/flightaware.js
[coveralls-image]: https://img.shields.io/coveralls/fdesjardins/flightaware.js.svg?style=flat
