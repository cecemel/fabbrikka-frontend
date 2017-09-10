import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('fabb-max-free-tries-reached-modal', 'Integration | Component | fabb max free tries reached modal', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{fabb-max-free-tries-reached-modal}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#fabb-max-free-tries-reached-modal}}
      template block text
    {{/fabb-max-free-tries-reached-modal}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
