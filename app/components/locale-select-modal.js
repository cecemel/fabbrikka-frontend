import Ember from 'ember';

export default Ember.Component.extend({
    localeSimpleLanguageMap:{"nl-be": "nederlands", "en-gb": "english"},

    localeTracker: Ember.inject.service('locale-tracker'),
    localeSelections: [],
    ready: false,

    multilocaleObeserver: Ember.observer("localeTracker.multiLocalesUser", "ready", function(){
        if(this.get('ready') && this.get('localeTracker').get("multiLocalesUser")){
            this._mapLocalesTolangLabels(this.get("localeTracker").get("multiLocalesUserAvailibleLocales"));
            this.$("#" + this.get("id")).modal('open');
        }
    }),

    id: Ember.computed('elementId', function() {
        return `${this.get('elementId')}-locale-select-modal`;
    }),

    didInsertElement(){
        this.$('.modal').modal({
            dismissible: true, // Modal can be dismissed by clicking outside of the modal
            opacity: 0.5, // Opacity of modal background
            inDuration: 300, // Transition in duration
            outDuration: 200, // Transition out duration
            startingTop: '4%', // Starting top style attribute
            endingTop: '10%', //
        });
        this.set("ready", true);
    },

    actions:{
        setLocale(locale){
            this.get('localeTracker').setLocale(locale);
            this.$("#" + this.get("id")).modal('close');
        }
    },

    _mapLocalesTolangLabels(locales){
        let self = this;
        //map only languages we have a translation for
        let mapped = locales.reduce((acc, locale) => {
                        let localeLabel = self.get("localeSimpleLanguageMap")[locale];
                        if(localeLabel){
                            acc.push({label: localeLabel, "locale": locale});
                        }
                        return acc;
                    }, []);
        self.set("localeSelections", mapped);
    }
});
