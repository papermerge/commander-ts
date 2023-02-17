import Component from '@glimmer/component';
import { action } from '@ember/object';

import type { BaseTreeNode } from 'commander-ts';

interface Args {
    node: BaseTreeNode;
    onClick: (node: BaseTreeNode) => void;
}

export default class FolderComponent extends Component<Args> {
    @action
    onClick() {
        this.args.onClick(this.args.node);
    }
}
