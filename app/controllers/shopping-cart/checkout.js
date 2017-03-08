import Ember from 'ember';

export default Ember.Controller.extend({
    actions:{
        handleGoogleAddressUpdate(place){
            let zip = place.address_components.find((item) => {
                return item["types"] && item["types"][0] === 'postal_code' && item["long_name"];
            }) || {};
            this.set('zip', zip['long_name'] || '');
        }
    }
});
