import Component from '@glimmer/component';
import { resource, use } from 'ember-resources';
import { TrackedObject, tracked } from 'tracked-built-ins';


interface Args {
  endpoint: string;
  onClick: (item: string) => void;
}


export default class Breadcrumb extends Component<Args> {

  @tracked data = new TrackedObject({});

  @use load = resource(({ on }) => {
    let state = new TrackedObject({
      isResolved: false,
      isLoading: true,
      isError:
      false,
      value: null,
      error: null
    });

    let controller = new AbortController();

    on.cleanup(() => controller.abort());

    fetch(`http://127.0.0.1:8000/api/folders/${this.args.endpoint}`,{
        signal: controller.signal,
        headers: {
          Authorization:
            'Token 0c724ad3d4101ba0b602c7fff44f4ff60c39e07d533c7eb7175c1b6d2efb47e3',
        },
    })
    .then(response => response.json())
    .then(result => {
      this.data = result.data ?? [];
      state.isResolved = true;
      state.isError = false;
      state.isLoading = false;
    })
    .catch(error => {
      state.error = error;
      state.isResolved = true;
      state.isError = true;
      state.isLoading = false;
    });

    return state;
  });
}
