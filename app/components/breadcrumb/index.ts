import Component from '@glimmer/component';
import { resource, use } from 'ember-resources';
import { TrackedObject, tracked } from 'tracked-built-ins';


type BreadcrumbItem = [string, string];

interface Args {
  endpoint: string;
  items: BreadcrumbItem[];
  isLoading: boolean;
  onClick: (item: string) => void;
}


export default class Breadcrumb extends Component<Args> {
  get isLoading(): boolean {
    return this.args.isLoading
  }

  get items(): BreadcrumbItem[] {
    return this.args.items;
  }
}
