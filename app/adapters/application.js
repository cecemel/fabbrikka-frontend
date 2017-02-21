import DS from 'ember-data';
import config from 'fabbrikka-frontend/config/environment';

export default DS.JSONAPIAdapter.extend({

  host: config.APP.backendHost,
});