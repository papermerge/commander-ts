import Component from '@glimmer/component';
import { resource, use } from 'ember-resources';
import { TrackedObject, TrackedArray, tracked } from 'tracked-built-ins';
import BreadcrumbItem from '../breadcrumb/item';


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
  isLoading: boolean;
  onClick: (node_id: string) => void;
  onLoadingStateChange: (new_state: boolean) => void;
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


export default class Commander extends Component<Args> {

  @tracked nodes = new TrackedArray([]);
  @tracked breadcrumb = new TrackedArray<BreadcrumbItem>();

  @use load = resource(({ on }) => {

    let state = new TrackedObject({
      isResolved: false,
      isLoading: true,
      isError:
      false,
      value: {},
      error: null
    });

    let controller = new AbortController();

    let nodes_promise = fetch(`http://127.0.0.1:8000/api/nodes/${this.args.endpoint}/`,{
      signal: controller.signal,
      headers: {
        Authorization:
          'Token 0c724ad3d4101ba0b602c7fff44f4ff60c39e07d533c7eb7175c1b6d2efb47e3',
      },
    }).then(response => response.json());

    let breadcrumb_promise = fetch(`http://127.0.0.1:8000/api/folders/${this.args.endpoint}/`,{
      signal: controller.signal,
      headers: {
        Authorization:
          'Token 0c724ad3d4101ba0b602c7fff44f4ff60c39e07d533c7eb7175c1b6d2efb47e3',
      },
    }).then(response => response.json());


    on.cleanup(() => controller.abort());

    this.args.onLoadingStateChange(true);

    Promise.all([nodes_promise, breadcrumb_promise])
    .then(result => {
      let node_items = result[0].data ?? [];
      
      this.nodes = node_items.map((item: IBaseTreeNode) => new BaseTreeNode(item));
      this.breadcrumb = result[1].data.attributes.breadcrumb ?? [];

      state.isResolved = true;
      state.isError = false;
      state.isLoading = false;
      this.args.onLoadingStateChange(false);
    })
    .catch(error => {
      state.error = error;
      state.isResolved = true;
      state.isError = true;
      state.isLoading = false;
      this.args.onLoadingStateChange(false);
    });

    return state;
  });
}
