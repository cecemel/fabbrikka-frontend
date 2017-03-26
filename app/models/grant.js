import DS from 'ember-data';

export default DS.Model.extend({
    accessTokens: DS.hasMany('access-token', {
	async: true
    }),
    authenticatables: DS.hasMany('authenticatable', {
	async: true
    })
});
