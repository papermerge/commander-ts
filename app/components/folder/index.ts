import Component from '@glimmer/component';
import { action } from '@ember/object';

import type { IBaseTreeNode } from 'commander-ts';

interface Args {
    node: IBaseTreeNode;
    onClick: (node_id: string|undefined) => void;
}

export default class FolderComponent extends Component<Args> {
    @action
    onClick() {
        this.args.onClick(this.args.node.id);
    }
}
