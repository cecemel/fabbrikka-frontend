import Ember from 'ember';

export default Ember.Component.extend({
    cookies: Ember.inject.service(),
    showDialog: false,

    _hasUserAcceptedCookies(){
      return this.get('cookies').read('accepted-cookies') === 'true';
    },

    _storeAcceptCookies(){
      var expiration_date = new Date();
      expiration_date.setFullYear(expiration_date.getFullYear() + 1);
      this.get('cookies').write('accepted-cookies', 'true', {expires: expiration_date, path:"/"});
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
