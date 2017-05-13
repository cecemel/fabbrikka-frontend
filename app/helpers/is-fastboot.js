import Ember from 'ember';

export default Ember.Helper.extend({
    fastboot: Ember.inject.service(),

    compute() {
        return this.get('fastboot.isFastBoot');
    }
});
