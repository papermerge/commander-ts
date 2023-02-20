import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { resource, use, resourceFactory } from 'ember-resources';
import { TrackedObject } from 'tracked-built-ins';


enum BaseTreeNodeType {
  folder = 'folders',
  document = 'document',
}

type BaseTreeNodeAttr = {
  title: string;
};

interface IBaseTreeNode {
  id: string;
  type: BaseTreeNodeType;
  attributes: BaseTreeNodeAttr;
}

interface Args {
  endpoint: string;
  onClick: (node_id: string) => void;
}

class BaseTreeNode implements IBaseTreeNode {
  id: string;
  type: BaseTreeNodeType;
  attributes: BaseTreeNodeAttr;

  constructor(item: IBaseTreeNode) {
    this.id = item.id;
    this.type = item.type;
    this.attributes = item.attributes;
  }

  get nodeType(): 'folder' | 'document' {
    if (this.type == BaseTreeNodeType.folder) {
      return 'folder';
    }

    return 'document';
  }
}

const NodesResource = resourceFactory((endpoint) => {

  return resource(({ on }) => {

    let current_endpoint = endpoint;

    if (typeof endpoint === 'function') {
      current_endpoint = endpoint();
    }

    let state = new TrackedObject({
      isResolved: false,
      isLoading: true,
      isError:
      false,
      value: null,
      error: null
    });

    let controller = new AbortController();

    console.log(endpoint);

    on.cleanup(() => controller.abort());

    fetch(`http://127.0.0.1:8000/api/nodes/${current_endpoint}/`,{
        signal: controller.signal,
        headers: {
          Authorization:
            'Token 0c724ad3d4101ba0b602c7fff44f4ff60c39e07d533c7eb7175c1b6d2efb47e3',
        },
    })
    .then(response => response.json())
    .then(result => {
      let items = result.data ?? [];
      state.value = items.map((item: IBaseTreeNode) => new BaseTreeNode(item));
      state.isResolved = true;
      state.isError = false;
      state.isLoading = false;
    })
    .catch(error => {
      state.error = error;
      state.isResolved = true;
      state.isError = true;
      state.isLoading = false;
    });

    return state;
  });
});


export default class Commander extends Component<Args> {

  @use load = NodesResource(() => this.args.endpoint);

}
