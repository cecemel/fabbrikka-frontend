import Ember from 'ember';

export default Ember.Component.extend({
    cookies: Ember.inject.service(),
    showDialog: false,

    _hasUserAcceptedCookies(){
      return this.get('cookies').read('accepted-cookies') === 'true';
    },

    _storeAcceptCookies(){
      this.get('cookies').write('accepted-cookies', 'true');
    },

    didInsertElement(){
        this._super(...arguments);
        this.set('showDialog', !this._hasUserAcceptedCookies());
    },

    actions:{
        acceptCookies(){
          this._storeAcceptCookies();
          this.set('showDialog', false);
        }
    }
});
