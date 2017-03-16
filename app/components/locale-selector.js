import Ember from 'ember';

export default Ember.Component.extend({
    tagName: "a",
    countryCode: "gb",
    languageCode: "",
    didInsertElement: function() {
        this.$(".locale-selector").dropdown();
    },
    actions:{
        setLocale(country, language){
            this.set('countryCode', country);
            this.set('languageCode', language);
        }
    }
});
