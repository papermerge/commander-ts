import Component from '@glimmer/component';
import { use } from 'ember-resources';

import { RemoteData, keepLatest, isEmpty } from 'commander-ts/resources/nodes';
import { action } from '@ember/object';
import { tracked, TrackedSet } from 'tracked-built-ins';
import { BaseTreeNode } from 'commander-ts/types';

interface Args {
  endpoint: string | undefined;
  isLoading: boolean;
  onClick: (node_id: string) => void;
}

export default class Commander extends Component<Args> {
  headers = {
    Authorization:
      'Token 0c724ad3d4101ba0b602c7fff44f4ff60c39e07d533c7eb7175c1b6d2efb47e3',
    'Content-type': 'application/vnd.api+json; charset=UTF-8',
  };

  @tracked _selected_nodes: TrackedSet<BaseTreeNode> = new TrackedSet<BaseTreeNode>([]);
  @tracked new_folder_modal: boolean = false;
  @tracked rename_modal: boolean = false;
  @tracked _selected_node: BaseTreeNode | null = null;

  // @ts-ignore
  @use _remote_data = RemoteData(() => ({endpoint: this.args.endpoint, headers: this.headers}));
  @use latest_data = keepLatest({
      value: () => this._remote_data.value,
      when: () => this._remote_data.isLoading,
  });

  get loading_uuid(): string | undefined {
    return this.args.endpoint;
  }

  get selected_nodes(): TrackedSet<BaseTreeNode> {
    /*
    Every time remote data reloads - reset selected nodes as well
    */
    if (isEmpty(this._remote_data.value)) {
      this._selected_nodes = new TrackedSet<BaseTreeNode>([]);
    }

    return this._selected_nodes;
  }

  get selected_node(): BaseTreeNode | null {
    /*
    Every time remote data reloads - reset selected node as well
    */
    if (isEmpty(this._remote_data.value)) {
      this._selected_node = null;
    }
    console.log("Selected Node");
    return this._selected_node;
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
  async onClickRename(node_id: string, new_title: string) {
    let node = this.get_node_by(node_id);
    let response = await fetch(
      `http://127.0.0.1:8000/api/${node.nodeType}s/${node_id}/`,
      {
        headers: this.headers,
        method: "PATCH",
        body: JSON.stringify({
          data: {
            id: node_id,
            type: `${node.nodeType}s`,
            attributes: {title: new_title}
          }
        })
      }
    );
    let json_response = await response.json();

    if (response.status == 200) {
      node.attributes.title = new_title;
      this.rename_modal = false;
    }
  }

  @action
  onCheckboxChange(node: BaseTreeNode, is_selected:  boolean) {
    /* Correct adjust `this._selected_node` and `this._selected_nodes` */
    if (is_selected) {
      this._selected_nodes.add(node);
    } else {
      this._selected_nodes.delete(node);
    }

    if (this._selected_nodes?.size == 1) {
      // retrieve the last and only element from ``this._selected_nodes``
      // set
      let all_values = Array.from(this._selected_nodes);
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

    return all_nodes.find((node: BaseTreeNode) => node.id == node_id)
  }
}
