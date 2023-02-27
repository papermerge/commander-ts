import Component from '@glimmer/component';
import { Resource } from 'ember-resources';
import { TrackedArray, tracked } from 'tracked-built-ins';


const BASE_URL = 'http://127.0.0.1:8000/api';

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

type onLoadingStateChangeType = (new_state: boolean) => void;

interface Args {
  endpoint: string | undefined;
  isLoading: boolean;
  onClick: (node_id: string) => void;
  onLoadingStateChange: onLoadingStateChangeType;
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

export default class FetchNodes extends Resource {
    named: any;
    positional: any;
    endpoint: string | undefined;
    base_url: string | undefined;
  
    @tracked nodes = new TrackedArray([]);
    @tracked breadcrumb = new TrackedArray([]);
    @tracked isResolved: boolean = true;
    @tracked isLoading: boolean = false;
    @tracked isError: boolean = false;
    @tracked error: string = '';
    onLoadingStateChange: onLoadingStateChangeType | undefined;
  
    modify(named: any, positional: any) {
      this.named = named;
      this.positional = positional;
      this.base_url = named[0];
      this.endpoint = named[1];
      this.onLoadingStateChange = named[2];
      let controller = new AbortController();
  
      let nodes_promise = fetch(`${this.base_url}/nodes/${this.endpoint}/`,{
        signal: controller.signal,
        headers: {
          Authorization:
            'Token 0c724ad3d4101ba0b602c7fff44f4ff60c39e07d533c7eb7175c1b6d2efb47e3',
        },
      }).then(response => response.json());
  
      let breadcrumb_promise = fetch(`${this.base_url}/folders/${this.endpoint}/`,{
        signal: controller.signal,
        headers: {
          Authorization:
            'Token 0c724ad3d4101ba0b602c7fff44f4ff60c39e07d533c7eb7175c1b6d2efb47e3',
        },
      }).then(response => response.json());
  
      if (this.onLoadingStateChange) {
        this.onLoadingStateChange(true);
      }
  
      this.isLoading = true;
  
      Promise.all([nodes_promise, breadcrumb_promise])
      .then(result => {
        let node_items = result[0].data ?? [];
        
        this.nodes = node_items.map((item: IBaseTreeNode) => new BaseTreeNode(item));
        this.breadcrumb = result[1].data.attributes.breadcrumb ?? [];
  
        this.isResolved = true;
        this.isError = false;
        this.isLoading = false;
        if (this.onLoadingStateChange) {
          this.onLoadingStateChange(false);
        }
      })
      .catch(error => {
        this.error = error;
        this.isResolved = true;
        this.isError = true;
        this.isLoading = false;
        if (this.onLoadingStateChange) {
          this.onLoadingStateChange(false);
        }
      });
    }
  }