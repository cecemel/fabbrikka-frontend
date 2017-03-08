import Ember from 'ember';

export default Ember.Component.extend({
    stripe: Ember.inject.service(),
    didInsertElement: () => {
         Ember.$.getScript('https://js.stripe.com/v3/', (data) => {
             console.log(data);
         });
     }
});
