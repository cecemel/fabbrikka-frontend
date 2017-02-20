import Ember from 'ember';
import DS from 'ember-data';

export default DS.JSONAPIAdapter.extend({

  host: 'http://localhost',
});