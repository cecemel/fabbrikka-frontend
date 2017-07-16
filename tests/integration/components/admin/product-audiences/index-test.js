import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('admin/product-audiences/index', 'Integration | Component | admin/product audiences/index', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{admin/product-audiences/index}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#admin/product-audiences/index}}
      template block text
    {{/admin/product-audiences/index}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
