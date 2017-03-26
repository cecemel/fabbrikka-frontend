import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr('string'),
    userGroups: DS.hasMany('user-group', {
	async: true
    }),
    grants: DS.hasMany('grant', {
	async: true
    })
});
