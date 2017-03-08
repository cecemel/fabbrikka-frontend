import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('credit-card-payment', 'Integration | Component | credit card payment', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{credit-card-payment}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#credit-card-payment}}
      template block text
    {{/credit-card-payment}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
