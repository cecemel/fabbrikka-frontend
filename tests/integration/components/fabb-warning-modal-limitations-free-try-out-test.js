import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('fabb-warning-modal-limitations-free-try-out', 'Integration | Component | fabb warning modal limitations free try out', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{fabb-warning-modal-limitations-free-try-out}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#fabb-warning-modal-limitations-free-try-out}}
      template block text
    {{/fabb-warning-modal-limitations-free-try-out}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
