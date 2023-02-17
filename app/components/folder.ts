import Component from '@glimmer/component';
import { action } from '@ember/object';

import type { BaseTreeNode } from 'commander-ts';

interface FolderCompSign {
    node: BaseTreeNode;
    onClick: (node: BaseTreeNode) => void;
}

export default class FolderComponent extends Component<FolderCompSign> {
    @action
    onClick() {
        this.args.onClick(this.args.node);
    }
}
