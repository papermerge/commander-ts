import Component from '@glimmer/component';
import { BaseTreeNode } from 'commander-ts/types';
import { action } from '@ember/object';
import { task } from 'ember-concurrency';
import { delete_nodes } from 'commander-ts/requests';

interface Args {
  nodes: BaseTreeNode[];
  selected_nodes: BaseTreeNode[];
  modalClose: () => void;
}

export default class DeleteNodeModal extends Component<Args> {

  delete_nodes_task = task(
    {drop: true},
    async (nodes: BaseTreeNode[], selected_nodes: BaseTreeNode[]) => {
      let controller = new AbortController();

      try {
        await delete_nodes(nodes, selected_nodes, controller);
        // this.args.nodes.push(new_node);
        this.args.modalClose();

      } catch(e) {
        console.log(`Ooops ${e}`);
      } finally {
        controller.abort();
      }
  });

  @action
  async onClickCreate() {
    this.delete_nodes_task.perform(this.args.nodes, this.args.selected_nodes);
  }

  @action
  async onClickCancel() {
    this.delete_nodes_task.cancelAll();
    this.args.modalClose();
  }
}
