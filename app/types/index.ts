import { tracked, TrackedObject } from 'tracked-built-ins';

export enum BaseTreeNodeType {
  folder = 'folders',
  document = 'document',
}

export type BreadcrumbItem = [string, string];

export type FolderAttrType = {
  created_at: string;
  updated_at: string;
  tags: string[];
  title: string,
  breadcrumb: BreadcrumbItem[]
}

export type DocumentAttrType = {
  created_at: string;
  updated_at: string;
  tags: string[];
  title: string,
  breadcrumb: BreadcrumbItem[],
  file_name?: string,
  lang: string,
  ocr: boolean,
  ocr_status: string,
  page_count?: number;
  size?: number;
}

export type RelationshipsAttrType = {
  parent: {
    data: {
      id: string;
      type: "folders";
    }
  }
}

export type FolderNodeType = {
  type: "folders",
  id: string,
  attributes: FolderAttrType,
  relationships: RelationshipsAttrType
}

export type BaseTreeNodeAttrType = DocumentAttrType | FolderAttrType;

export interface IBaseTreeNode {
  id: string;
  type: BaseTreeNodeType;
  attributes: BaseTreeNodeAttrType;
  relationships: RelationshipsAttrType;
}

export class BaseTreeNode implements IBaseTreeNode {
  id: string;
  type: BaseTreeNodeType;
  @tracked attributes: BaseTreeNodeAttrType;
  @tracked relationships: RelationshipsAttrType;

  constructor(item: IBaseTreeNode) {
    this.id = item.id;
    this.type = item.type;
    this.attributes = new TrackedObject({
      title: item.attributes.title,
      created_at: item.attributes.created_at,
      updated_at: item.attributes.updated_at,
      tags: item.attributes.tags,
      breadcrumb: item.attributes.breadcrumb
    });
    this.relationships = new TrackedObject({
      parent: {
        data: {
          id: item.relationships.parent.data.id,
          type: "folders"
        }
      }
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
