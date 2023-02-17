import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking'
import { trackedFunction } from 'ember-resources/util/function';
import { action } from '@ember/object';
import type { BaseTreeNode } from 'commander-ts';


export default class Breadcrumb extends Component {
    @tracked endpoint = 'be97f78c-82db-417d-a62b-e3c048295a41';

    data = trackedFunction(this, async() => {
        let response = await fetch(`http://127.0.0.1:8000/api/folders/${this.endpoint}/`,
            {
                headers: {
                    'Authorization': 'Token 0c724ad3d4101ba0b602c7fff44f4ff60c39e07d533c7eb7175c1b6d2efb47e3'
                }
            }
        );
        let json = await response.json();
    
        return json.data;
    });

    get nodes() {
        return this.data.value?? [];
    }

    @action
    onNodeClick(node: BaseTreeNode) {
        this.endpoint = node.id;
    }
}