import Component from '@glimmer/component';
import { BaseTreeNode } from 'commander-ts/types';
import { action } from '@ember/object';
import { tracked } from 'tracked-built-ins';


interface Args {
  node: BaseTreeNode;
  onClickRename: (node_id: string, new_title: string) => void;
}

export default class RenameModal extends Component<Args> {

  @tracked _title: string = '';

  get title(): string {
    if (this._title == '' && this.args.node) {
      return this.args.node.attributes.title;
    }

    return this._title;
  }

  set title(value: string) {
    this._title = value;
  }

  @action
  async onClickRename() {
    await this.args.onClickRename(this.args.node.id, this._title);
  }
}
