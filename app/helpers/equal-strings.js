import Ember from 'ember';

export function equalStrings(params) {
  return params[0] === params[1];
}

export default Ember.Helper.helper(equalStrings);
