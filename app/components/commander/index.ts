import Component from '@glimmer/component';
import { trackedFunction } from 'ember-resources/util/function';

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

export default class Commander extends Component<Args> {
  data = trackedFunction(this, async () => {
    const response = await fetch(
      `http://127.0.0.1:8000/api/nodes/${this.args.endpoint}/`,
      {
        headers: {
          Authorization:
            'Token 0c724ad3d4101ba0b602c7fff44f4ff60c39e07d533c7eb7175c1b6d2efb47e3',
        },
      }
    );
    const json = await response.json();
    return json.data;
  });

  get nodes(): BaseTreeNode[] {
    const items = this.data.value ?? [];

    return items.map((item: IBaseTreeNode) => new BaseTreeNode(item));
  }
}