/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'fabbrikka-frontend',
    environment: environment,
    rootURL: '/',
    locationType: 'router-scroll',
    historySupportMiddleware: true,
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
      backendHost: "",
      localeGuesser: "/fabbrikka-locale-guesser",
      cartService: "/fabbrikka-cart-service",
      checkoutService: "/fabbrikka-checkout-service",
    },
    "place-autocomplete": {
       key: 'AIzaSyD8SUmgYvE2yOjNr0BeKO90ptR68hFFHNQ',
    },
    stripe: {
        key: 'pk_test_Od5jsn7vV50m8Y8OBf6ebmN5'
    },
    "ember-mu-login": {
       sessionBasePath: "/sessions",
    },
    fastboot: {
      hostWhitelist: ['test.fabbrikka.com','fabb-test.ruizdearcaute.com', 'ember', 'playground.ruizdearcaute.com', /^localhost:\d+$/]
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
    ENV.APP.backendHost="";
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
   ENV.APP.backendHost=""
  }

  return ENV;
};
