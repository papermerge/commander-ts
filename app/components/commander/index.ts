import Component from '@glimmer/component';
import { use } from 'ember-resources';

import { RemoteData, keepLatest } from 'commander-ts/resources/nodes';

interface Args {
  endpoint: string | undefined;
  isLoading: boolean;
  onClick: (node_id: string) => void;
}

export default class Commander extends Component<Args> {
  headers = {
    Authorization:
      'Token 0c724ad3d4101ba0b602c7fff44f4ff60c39e07d533c7eb7175c1b6d2efb47e3',
  };

  // @ts-ignore
  @use myData = RemoteData(() => ({endpoint: this.args.endpoint, headers: this.headers}));
  @use latestData = keepLatest({value: () => this.myData.value, when: () => this.myData.isLoading,});

  get loading_uuid(): string | undefined {
    return this.args.endpoint;
  }
}
