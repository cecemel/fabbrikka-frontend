import Ember from 'ember';

export default Ember.Component.extend({
    localeTracker: Ember.inject.service('locale-tracker'),
    tagName: "a",
    country: "gb",
    language: "en",

    init(){
        this._super(...arguments);
        this._setLocaleString(this.get("localeTracker").getLocale());
    },

    didInsertElement: function() {
        this.$(".locale-selector").dropdown();
    },

    actions:{
        setLocale(country, language){
            this.set('country', country);
            this.set('language', language);
            this.get('localeTracker').setLocale(language.toLowerCase() + "-" + country.toLowerCase());
        }
    },

    _setLocaleString(locale){
        let split = locale.split("-");
        this.set("language", split[0]);
        this.set("country", split[1]);
    }
});
