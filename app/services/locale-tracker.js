import Ember from 'ember';

export default Ember.Service.extend({
    i18n: Ember.inject.service(),
    cookies: Ember.inject.service(),

    init(){
        //first check if was set previously
        this._super(...arguments);
        let locale = this._fetchLocaleFromCookie();

        if (locale && locale.length !== 0){
            this.setLocale(locale);
            return;
        }

        //check if specified in url

        //ok nothing found set the default here


        //fetch from remote
            //whilst callback resolved, the user could have set the language himself.
            //so doublecheck the cookies

    },

    setLocale(locale){
        let locales = this.get("i18n").get('locales');
        let selectedLocale  = locales.includes(locale) ? locale : 'en-gb';

        this.set('i18n.locale', selectedLocale);
        this.get('cookies').write("locale-user", selectedLocale);
    },

    getLocale(){
        return this._fetchLocaleFromCookie() //prefer it form the cookie
    },

    _fetchLocaleFromCookie(){
        return this.get('cookies').read("locale-user");
    }

    //
    // _fetch(){
    //     //
    // }

});
