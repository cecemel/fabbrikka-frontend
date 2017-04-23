import Ember from 'ember';

const { Component, computed, isPresent } = Ember;

export default Component.extend({
  layout:null,
  type: 'text',
  labelIsActive: false,
  classNames: ['input-field'],

  bindAttributes: ['disabled', 'readonly', 'autofocus'],
  validate: false,
  _wasTouched: false,
  isValid: computed('_wasTouched', 'value', 'validate', 'errors', 'errors.[]', function() {
    return (isPresent(this.get('value')) || this.get('_wasTouched')) && this.get('validate') && this.get('errors') && this.get('errors.length') === 0;
  }),

  isInvalid: computed('_wasTouched', 'value', 'validate', 'errors', 'errors.[]', function() {
    return this.get('validate') && this.get('errors') && this.get('errors.length') > 0;
  }),

  isActiveLabel: Ember.observer('value', 'errors', 'errors.[]', function() {
      const $label = this.$('> label');
      $label.addClass('active'); //as soon as something happens on the field it is considered active
      this.set('labelIsActive', true);
  }),

  didInsertElement() {
    this._super(...arguments);
    // pad the errors element when an icon is present
    if (isPresent(this.get('icon'))) {
      this.$('> span').css('padding-left', '3rem');
    }
    this._setupLabel();
  },

  id: computed('elementId', function() {
    return `${this.get('elementId')}-input`;
  }),

  _setupLabel() {
    const $label = this.$('> label');
    if ((isPresent(this.get('value')) && !$label.hasClass('active'))|| this.get('isInvalid')) {
      $label.addClass('active');
    }
  },
  _errorString: computed('errors.[]', function() {
    return (this.get('errors') || []).join('. ');
  }),
  actions: {
    inputFocusIn(evt) {
      this.set('_wasTouched', true);
      this.sendAction('focusIn', evt);
    },
    inputFocusOut(){
        if(this.get('isInvalid')){
            return false;
        }
    }

  }
});
