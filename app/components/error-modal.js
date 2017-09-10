import Ember from 'ember';

export default Ember.Component.extend({
    toggleOpen: Ember.observer('status', function(){
        if(this.get('status')){
            this.$("#" + this.get("id")).modal('open');
            return;
        }
        this.$("#" + this.get("id")).modal('close');
    }),

    id: Ember.computed('elementId', function() {
        return `${this.get('elementId')}-error-modal`;
    }),

    didInsertElement(){
      let self = this;
      this._initModal(function() {
        if(self.get('status')){
          self.set('status', false);
        }
      });
    },

    _initModal(callback){
      this.$('#' + this.get('id')).modal({
          dismissible: true, // Modal can be dismissed by clicking outside of the modal
          opacity: 0.5, // Opacity of modal background
          inDuration: 300, // Transition in duration
          outDuration: 200, // Transition out duration
          startingTop: '4%', // Starting top style attribute
          endingTop: '10%',
          complete: callback,
      });
    },

    willDestroyElement(){
      this._super(...arguments);
      this._initModal(null); //hackish...
      this.$('#' + this.get('id')).modal('close');
    },

    actions: {
        onAgree(){
            this.set('status', false);
        }
    }
});
