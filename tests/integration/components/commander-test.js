import { module, test } from 'qunit';
import { setupRenderingTest } from 'commander-ts/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | commander', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<Commander />`);

    assert.dom(this.element).hasText('');

    // Template block usage:
    await render(hbs`
      <Commander>
        template block text
      </Commander>
    `);

    assert.dom(this.element).hasText('template block text');
  });
});
