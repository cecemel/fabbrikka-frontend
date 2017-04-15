import Ember from 'ember';

export default Ember.Component.extend({
    localeTracker: Ember.inject.service('locale-tracker'),
    tagName: "a",
    country: "gb",
    language: "en",

    id: Ember.computed('elementId', function() {
        return `${this.get('elementId')}-locale-selector`;
    }),

    init(){
        this._super(...arguments);
        this._setLocaleString(this.get("localeTracker").getLocale());
    },

    didInsertElement() {
        this.$(".locale-selector").dropdown({belowOrigin: true});
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
    },

    _localeObserver: Ember.observer("localeTracker.locale",function(){
        this._setLocaleString(this.get("localeTracker.locale"));
    })
});
