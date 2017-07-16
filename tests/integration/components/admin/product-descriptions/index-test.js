import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('admin/product-descriptions/index', 'Integration | Component | admin/product descriptions/index', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{admin/product-descriptions/index}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#admin/product-descriptions/index}}
      template block text
    {{/admin/product-descriptions/index}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
