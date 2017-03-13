/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'fabbrikka-frontend',
    environment: environment,
    rootURL: '/app/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
      backendHost: ""
    },
    "place-autocomplete": {
       key: 'AIzaSyD8SUmgYvE2yOjNr0BeKO90ptR68hFFHNQ',
    },
    stripe: {
        key: 'pk_test_Od5jsn7vV50m8Y8OBf6ebmN5'
    },
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
    ENV.APP.backendHost="http://localhost";
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.backendHost="http://playground.ruizdearcaute.com:6970"
  }

  if (environment === 'production') {
   ENV.APP.backendHost="http://fabb-test.ruizdearcaute.com"
  }

  return ENV;
};
