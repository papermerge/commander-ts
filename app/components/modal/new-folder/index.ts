import Component from '@glimmer/component';
import { BaseTreeNode } from 'commander-ts/types';
import { action } from '@ember/object';
import { tracked } from 'tracked-built-ins';
import { task } from 'ember-concurrency';
import { new_folder } from 'commander-ts/requests';

interface Args {
  nodes: BaseTreeNode[];
  parent_id: string;
  modalClose: () => void;
}

export default class NewFolderModal extends Component<Args> {

  @tracked new_title: string|null = null;

  new_folder_task = task(
    {drop: true},
    async (parent_id: string, new_title: string|null) => {
      let controller = new AbortController();
      let new_node: BaseTreeNode;

      try {
        new_node = await new_folder(parent_id, new_title, controller);

        if (new_node) {
          this.args.nodes.push(new_node);
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
  async onClickCreate() {
    this.new_folder_task.perform(this.args.parent_id, this.new_title);
  }

  @action
  async onClickCancel() {
    this.new_folder_task.cancelAll();
    this.args.modalClose();
    this.new_title = null;
  }
}
