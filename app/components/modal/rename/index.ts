import Component from '@glimmer/component';
import { BaseTreeNode } from 'commander-ts/types';
import { action } from '@ember/object';
import { tracked } from 'tracked-built-ins';
import { trackedFunction } from 'ember-resources/util/function';
import { State } from 'ember-resources/util/function';
import { task } from 'ember-concurrency';
import { rename_node } from 'commander-ts/requests';

interface Args {
  node: BaseTreeNode;
  modalClose: () => void;
}

export default class RenameModal extends Component<Args> {

  @tracked new_title: string|null = null;
  @tracked processing: boolean = false;

  headers = {
    Authorization:
      'Token 0c724ad3d4101ba0b602c7fff44f4ff60c39e07d533c7eb7175c1b6d2efb47e3',
    'Content-type': 'application/vnd.api+json; charset=UTF-8',
  };

  // every time node changes, `old_title` changes as well
  old_title: State<string|null> = trackedFunction(this, async () => {
    let node = this.args.node;
    return node?.attributes.title;
  })

  get title(): string|null {
    if (this.new_title == '' || this.new_title?.trim() == '') {
      return '';
    }
    return this.new_title || this.old_title?.value;
  }

  set title(value: string|null) {
    this.new_title = value;
  }

  rename_node_task = task(
    {drop: true},
    async (node: BaseTreeNode, new_title: string|null) => {
      let controller = new AbortController();

      try {
        await rename_node(node, new_title, controller);

        if (new_title) {
          node.attributes.title = new_title;
          this.args.modalClose();
        }
      } catch(e) {
        console.log(`Ooops ${e}`);
      } finally {
        controller.abort();
        this.new_title = null;
      }
  });

  @action
  async onClickRename() {
    this.rename_node_task.perform(this.args.node, this.title);
  }

  @action
  async onClickCancel() {
    this.rename_node_task.cancelAll();
    this.args.modalClose();
    this.new_title = null;
  }
}
