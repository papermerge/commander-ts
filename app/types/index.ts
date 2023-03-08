import { tracked, TrackedObject } from 'tracked-built-ins';

export enum BaseTreeNodeType {
  folder = 'folders',
  document = 'document',
}

export type BaseTreeNodeAttr = {
  title: string;
};

export interface IBaseTreeNode {
  id: string;
  type: BaseTreeNodeType;
  attributes: BaseTreeNodeAttr;
}

export class BaseTreeNode implements IBaseTreeNode {
  id: string;
  type: BaseTreeNodeType;
  @tracked attributes: BaseTreeNodeAttr;

  constructor(item: IBaseTreeNode) {
    this.id = item.id;
    this.type = item.type;
    this.attributes = new TrackedObject({
      title: item.attributes.title,
    });
  }

  get nodeType(): 'folder' | 'document' {
    if (this.type == BaseTreeNodeType.folder) {
      return 'folder';
    }
    return 'document';
  }
}

export type NodesWithBreadcrumb = {
  nodes: BaseTreeNode[];
  breadcrumb: BaseTreeNode[];
};
