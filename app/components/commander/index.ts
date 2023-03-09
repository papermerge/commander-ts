import Component from '@glimmer/component';
import { use } from 'ember-resources';

import { State } from 'commander-ts/resources/state';
import { trackedFunction } from 'ember-resources/util/function';
import { RemoteData, keepLatest, isEmpty } from 'commander-ts/resources/nodes';
import { action } from '@ember/object';
import { tracked, TrackedSet } from 'tracked-built-ins';
import { BaseTreeNode, NodesWithBreadcrumb } from 'commander-ts/types';

interface Args {
  endpoint: string | null;
  isLoading: boolean;
  onClick: (node_id: string) => void;
}

export default class Commander extends Component<Args> {
  headers = {
    Authorization:
      'Token 0c724ad3d4101ba0b602c7fff44f4ff60c39e07d533c7eb7175c1b6d2efb47e3',
    'Content-type': 'application/vnd.api+json; charset=UTF-8',
  };

  // modals
  @tracked new_folder_modal: boolean = false;
  @tracked rename_modal: boolean = false;
  @tracked delete_nodes_modal: boolean = false;

  // @ts-ignore
  @use _remote_data = RemoteData<NodesWithBreadcrumb>(() => ({endpoint: this.args.endpoint, headers: this.headers}));
  @use latest_data = keepLatest({
    value: () => this._remote_data.value,
    when: () => this._remote_data.isLoading,
  });

  // Every time this.args.endpoint changes, list of selected nodes
  // is emptied. In other words, every time user navigates to different
  // folder - list of selected nodes is made empty
  _selected_nodes = trackedFunction(this, async() => {
    let _endpoint = this.args.endpoint;
    let _sel_nodes = new TrackedSet<BaseTreeNode>([]);

    return _sel_nodes;
  });
  @tracked _selected_node: BaseTreeNode | null = null;

  get loading_uuid(): string | null {
    return this.args.endpoint;
  }

  get endpoint(): string | null {
    return this.args.endpoint;
  }

  get selected_nodes(): TrackedSet<BaseTreeNode> | null {
    return this._selected_nodes?.value;
  }

  get selected_node(): BaseTreeNode | null {
    return this._selected_node;
  }

  get only_one_node_selected(): boolean {
    return this._selected_nodes?.value?.size === 1;
  }

  get multiple_nodes_selected(): boolean {
    if (!this._selected_nodes) {
      return false;
    }
    if (this._selected_nodes?.value) {
      return this._selected_nodes?.value?.size > 1;
    }
    return false;
  }

  @action
  onNewFolder() {
    this.new_folder_modal = true;
  }

  @action
  onRename() {
    this.rename_modal = true;
  }

  @action
  onDeleteNodes() {
    this.delete_nodes_modal = true;
  }

  @action
  async renameModalClose() {
    this.rename_modal = false;
  }

  @action
  async newFolderModalClose() {
    this.new_folder_modal = false;
  }

  @action
  deleteNodesModalClose() {
    this.delete_nodes_modal = false;
  }

  @action
  onCheckboxChange(node: BaseTreeNode, is_selected:  boolean) {
    /* Correct adjust `this._selected_node` and `this._selected_nodes` */
    if (is_selected) {
      this._selected_nodes.value?.add(node);
    } else {
      this._selected_nodes.value?.delete(node);
    }

    if (this._selected_nodes?.value?.size == 1) {
      // retrieve the last and only element from ``this._selected_nodes``
      // set
      let all_values = Array.from(this._selected_nodes?.value || []);
      if (all_values) {
        if (all_values[0]) {
          this._selected_node = all_values[0];
        }
      }
    } else {
      this._selected_node = null;
    }
  }

  get_node_by(node_id: string): BaseTreeNode {
    // @ts-ignore
    let all_nodes = this.latest_data.nodes;

    // @ts-ignore
    return all_nodes.find((node: BaseTreeNode) => node.id == node_id)
  }
}
