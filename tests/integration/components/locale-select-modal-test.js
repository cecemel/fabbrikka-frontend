import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('locale-select-modal', 'Integration | Component | locale select modal', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{locale-select-modal}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#locale-select-modal}}
      template block text
    {{/locale-select-modal}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
