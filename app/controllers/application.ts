import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ApplicationController extends Controller {
  @tracked endpoint: string | undefined =
    'be97f78c-82db-417d-a62b-e3c048295a41';

  @action
  onNodeClick(node_id: string | undefined) {
    this.endpoint = node_id;
  }
}
