import Ember from 'ember';

export default Ember.Component.extend({
    isPageReadyObserver: Ember.observer('scriptDownloaded', 'hasRendered', function(){
        if(this.get('scriptDownloaded') && this.get('hasRendered')){
        }
    }),

    didInsertElement() {
        let self = this;
         Ember.$.getScript('https://js.stripe.com/v3/', () => {
             self.set('scriptDownloaded', true);
         });
     },

     didRender(){
         this.set('hasRendered', true);
    },
});
