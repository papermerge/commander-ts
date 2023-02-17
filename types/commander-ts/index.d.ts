import Ember from 'ember';

declare global {
  // Prevents ESLint from "fixing" this via its auto-fix to turn it into a type
  // alias (e.g. after running any Ember CLI generator)
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Array<T> extends Ember.ArrayPrototypeExtensions<T> {}
  // interface Function extends Ember.FunctionPrototypeExtensions {}
}


declare module 'commander-ts' {
  export enum BaseTreeNodeType {
    folder = "folders",
    document = "document",
  }

  export type BaseTreeNodeAttr = {
    title: string
  };

  export interface BaseTreeNode {
    id: string;
    type: BaseTreeNodeType;
    attributes: BaseTreeNodeAttr;
  }
}
