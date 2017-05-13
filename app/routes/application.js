import Ember from 'ember';

export default Ember.Route.extend({
    fastboot: Ember.inject.service(),
    actions: {
        loading(transition) {
            let controller = this.controllerFor('application');
            controller.set('currentlyLoading', true);
            transition.promise.finally(function() {
                    controller.set('currentlyLoading', false);
          });
        }
}
});
