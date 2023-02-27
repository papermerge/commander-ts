import Component from '@glimmer/component';
import { use } from 'ember-resources';
import FetchNodes from "../../resources/nodes";

const BASE_URL = 'http://127.0.0.1:8000/api';

type onLoadingStateChangeType = (new_state: boolean) => void;

interface Args {
  endpoint: string | undefined;
  isLoading: boolean;
  onClick: (node_id: string) => void;
  onLoadingStateChange: onLoadingStateChangeType;
}

export default class Commander extends Component<Args> {
  // @ts-ignore
  @use data = FetchNodes.from(() => [BASE_URL, this.args.endpoint]);

  get loading_uuid(): string | undefined {
    return this.args.endpoint;
  }
}
