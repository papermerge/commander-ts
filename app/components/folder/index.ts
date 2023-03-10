import Component from '@glimmer/component';
import { action } from '@ember/object';
import type {
  IBaseTreeNode,
} from "commander-ts/types";

interface Args {
  node: IBaseTreeNode;
  is_loading: boolean;
  onClick: (node_id: string | undefined) => void;
  onCheckboxChange: (node: IBaseTreeNode, is_selected: boolean) => void;
}

export default class FolderComponent extends Component<Args> {
  @action
  onClick() {
    this.args.onClick(this.args.node.id);
  }

  get is_loading(): boolean {
    return this.args.is_loading;
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
