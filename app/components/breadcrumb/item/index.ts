import { action } from '@ember/object';
import Component from '@glimmer/component';

interface Args {
  id: string;
  title: string;
  onClick: (item: string) => void;
}

export default class BreadcrumbItem extends Component<Args> {
  @action
  onClick() {
    this.args.onClick(this.args.id);
  }
}
