import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('fabb-loading-hider', 'Integration | Component | fabb loading hider', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{fabb-loading-hider}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#fabb-loading-hider}}
      template block text
    {{/fabb-loading-hider}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
