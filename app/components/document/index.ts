import Component from '@glimmer/component';
import { action } from '@ember/object';

import type {
  IBaseTreeNode,
} from "commander-ts/types";


interface Args {
  node: IBaseTreeNode;
  onClick: (node_id: string | undefined) => void;
  onCheckboxChange: (node: IBaseTreeNode, is_selected: boolean) => void;
}

export default class DocumentComponent extends Component<Args> {
  @action
  onClick() {
    this.args.onClick(this.args.node.id);
  }

  @action
  onCheckboxChange(event: any) {
    let is_checked = event.target.checked;

    this.args.onCheckboxChange(
      this.args.node,
      is_checked
    );
  }
}
