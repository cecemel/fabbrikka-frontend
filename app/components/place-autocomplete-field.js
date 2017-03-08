import Ember from 'ember';
import layout from '../templates/components/place-autocomplete-field';

const { Component, isEmpty, isPresent, typeOf, isEqual, run } = Ember;

export default Component.extend({
  layout: layout,
  disabled: false,
  inputClass: 'place-autocomplete--input',
  types: 'geocode',
  restrictions: {},
  tabindex: 0,
  withGeoLocate: false,

  // @see https://developers.google.com/maps/documentation/javascript/places-autocomplete#set_search_area
  geolocate() {
    let navigator = this.get('navigator') || ((window) ? window.navigator : null);
    if (navigator && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        let google = this.get('google') || window.google;
        var geolocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        var circle = new google.maps.Circle({
          center: geolocation,
          radius: position.coords.accuracy
        });
        this.get('autocomplete').setBounds(circle.getBounds());
      });
    }
  },

  didInsertElement() {
    this._super(...arguments);
    run.scheduleOnce('afterRender', this, 'setupComponent');
  },

  setupComponent() {
    this.getAutocomplete();
    this.get('autocomplete').addListener('place_changed', () => {
      run(() => { this.placeChanged(); });
    });
    if (this.get("withGeoLocate")) {
      this.geolocate();
    }
  },


  willDestroy() {
    if (isPresent(this.get('autocomplete'))) {
      let google = this.get('google') || ((window) ? window.google : null);
      if(google){
        google.maps.event.clearInstanceListeners(this.get('autocomplete'));
      }
    }
  },

  getAutocomplete() {
    if(isEmpty(this.get('autocomplete'))){
      if(document && window){
        let inputElement = document.getElementById(this.elementId).getElementsByTagName('input')[0],
            google = this.get('google') || window.google, //TODO: check how to use the inyected google object
            autocomplete = new google.maps.places.Autocomplete(inputElement, { types: this._typesToArray()});
        this.set('autocomplete', autocomplete);
      }
    }
  },

  placeChanged() {
    let place =  this.get('autocomplete').getPlace();
    this._callCallback('placeChangedCallback', place);
    this.set('value', place.formatted_address);
  },

  _callCallback(callback, place) {
    let callbackFn = this.attrs[callback];
    if (isEqual(typeOf(callbackFn), 'function')) {
      callbackFn(place);
    } else {
        this.sendAction(callback, place); //bugfix see best pracitces: http://stackoverflow.com/a/19059590/1092608
    }
  },

  _typesToArray() {
    if (this.get('types') !== "") {
      return this.get('types').split(',');
    } else {
      return [];
    }
  },

  actions: {
    focusOut() {
      this._callCallback('focusOutCallback');
    }
  }
});
