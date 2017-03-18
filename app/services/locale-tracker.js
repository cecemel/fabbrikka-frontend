import Ember from 'ember';
import config from 'fabbrikka-frontend/config/environment';

export default Ember.Service.extend({
    defaultLocale: 'en-gb',
    multiLocalesUser: false,
    multiLocalesUserAvailibleLocales: [],
    i18n: Ember.inject.service(),
    cookies: Ember.inject.service(),
    ajax: Ember.inject.service(),

    locale: Ember.computed.reads('i18n.locale'),

    init(){
        //first check if was set previously
        this._super(...arguments);

        if(this._hasUserSetLocale()){
            this.setLocale(this._fetchLocaleFromCookie());
            return;
        }

        //check if specified in url
        if(this._haseLocalefromURL()){
            this.setLocale(this._fetchLocaleFromURL());
            return;
        }

        //ok nothing found set the default here
        this.set('i18n.locale', this.get('defaultLocale'));

        //last resort, let's see whether the locale guesser can tell us something
        this._setLocaleFromRemote();

    },

    setLocale(locale){
        let locales = this.get("i18n").get('locales');
        let selectedLocale  = locales.includes(locale) ? locale : this.get('defaultLocale');

        this.set('i18n.locale', selectedLocale);
        this.get('cookies').write("locale-user", selectedLocale);
    },

    getLocale(){
        return this.get('i18n.locale');
    },

    _fetchLocaleFromCookie(){
        return this.get('cookies').read("locale-user");
    },

    _fetchLocaleFromRemote(){
        return this.get('ajax').request(config.APP.localeGuesser);
    },

    _fetchLocaleFromURL(){
        ////////////////////////////////////////////////////////////////////////
        //TODO: HAKING ALERT!!! find out what the proper way is...
        ////////////////////////////////////////////////////////////////////////
        console.log("WARNING: locale-tracker.js still contains an hack!");
        let queryParams = location.search.substring(1);
        let routerInstance = Ember.getOwner(this).lookup('router:main');

        if(queryParams.length > 0){
            let query = routerInstance.router.recognizer.parseQueryString(queryParams);
            return query["locale"];
        }
    },

    _haseLocalefromURL(){
        let locale = this._fetchLocaleFromURL();
        if (locale && locale.length !== 0){
            return true;
        }
        return false;
    },

    _hasUserSetLocale(){
        let userLocale = this.getLocale();
        if(userLocale && userLocale.length !== 0){
            return true;
        }
        return false;
    },

    _setLocaleFromRemote(){
        this._fetchLocaleFromRemote()
        .then((locales) => {

            if(locales.length === 0) {
                return;
            }

            if(this._hasUserSetLocale()) { //user could have set it while waiting
                return;
            }

            if(locales.length > 0){
                //some consumging component can do something with this info
                this.set('multiLocalesUser', true);
                this.set('multiLocalesUserAvailibleLocales', locales);
            }

            this.setLocale(locales[0]);
        });
    }

});
