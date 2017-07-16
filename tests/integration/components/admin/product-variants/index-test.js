import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('admin/product-variants/index', 'Integration | Component | admin/product variants/index', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{admin/product-variants/index}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#admin/product-variants/index}}
      template block text
    {{/admin/product-variants/index}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
