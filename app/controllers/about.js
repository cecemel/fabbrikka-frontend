import Ember from 'ember';

export default Ember.Controller.extend({
    localeTracker: Ember.inject.service('locale-tracker'),
    locale: Ember.computed.reads('localeTracker.locale'),
    //todo fix with proper observer behaviour
    localeObserver : Ember.observer('localeTracker.locale', function(){
        this.set('locale', this.get('localeTracker').get('locale'));
    })
});
