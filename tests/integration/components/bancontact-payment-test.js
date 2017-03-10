import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('bancontact-payment', 'Integration | Component | bancontact payment', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{bancontact-payment}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#bancontact-payment}}
      template block text
    {{/bancontact-payment}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
