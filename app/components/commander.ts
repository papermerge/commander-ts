import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking'
import { TrackedObject } from 'tracked-built-ins';
import { resource, use } from 'ember-resources';
import { action } from '@ember/object';

import type { BaseTreeNode } from 'commander-ts';


export default class Commander extends Component {
    @tracked endpoint = 'be97f78c-82db-417d-a62b-e3c048295a41';

    @use load = resource(({ on }) => {
        let state = new TrackedObject({value: '', error: ''});
        let controller = new AbortController();
    
        on.cleanup(() => controller.abort());
    
        fetch(
            `http://127.0.0.1:8000/api/nodes/${this.endpoint}/`,
            {
                signal: controller.signal,
                headers: {
                    'Authorization': 'Token 0c724ad3d4101ba0b602c7fff44f4ff60c39e07d533c7eb7175c1b6d2efb47e3'
                }
            }
        )
          .then(response => response.json())
          .then(data => {
            console.log(data.data);
            state.value = data.data;
            // ...
          })
          .catch(error => {
            //state.error = error;
            // ...
            state.error = error;
          });
    
        return state;
    });

    @action
    onNodeClick(node: BaseTreeNode) {
        this.endpoint = node.id;
    }

    @action
    onHomeClick() {
        this.endpoint = 'be97f78c-82db-417d-a62b-e3c048295a41';
    }
}
