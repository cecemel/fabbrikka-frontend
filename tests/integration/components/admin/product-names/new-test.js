import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('admin/product-names/new', 'Integration | Component | admin/product names/new', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{admin/product-names/new}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#admin/product-names/new}}
      template block text
    {{/admin/product-names/new}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
