import Ember from 'ember';

export default Ember.Component.extend({
    actions: {
        delete(id) {
            this.sendAction('delete', id);
        }
    }
});
