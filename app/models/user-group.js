import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr('string'),
    users: DS.hasMany('user', {
	async: true
    }),
    grants: DS.hasMany('grant', {
	async: true
    }),
    subGroups: DS.hasMany('userGroup', {
	async: true,
	inverse: 'parentGroups'
    }),
    parentGroups: DS.hasMany('userGroup', {
	async: true,
	inverse: 'subGroups'
    })  
});
