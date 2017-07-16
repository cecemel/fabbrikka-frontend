import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('admin/product-descriptions/edit', 'Integration | Component | admin/product descriptions/edit', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{admin/product-descriptions/edit}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#admin/product-descriptions/edit}}
      template block text
    {{/admin/product-descriptions/edit}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
