import { resource, resourceFactory } from 'ember-resources';
import { TrackedObject, TrackedSet } from 'tracked-built-ins';
import { State } from 'commander-ts/resources/state';
import type { Hooks } from 'ember-resources/core/function-based/types';
import {
  FetchOptions,
  onLoadingStateChangeType,
} from 'commander-ts';
import type { IBaseTreeNode } from "commander-ts/types";
import { BaseTreeNode, NodesWithBreadcrumb } from 'commander-ts/types';


const BASE_URL = 'http://127.0.0.1:8000/api';


interface Args {
  endpoint: string | undefined;
  isLoading: boolean;
  onClick: (node_id: string) => void;
  onLoadingStateChange: onLoadingStateChangeType;
}

export const isEmpty = (x: undefined | unknown | unknown[]) => {
  if (Array.isArray(x)) {
    return x.length === 0;
  }

  if (typeof x === 'object') {
    if (x === null) return true;

    return Object.keys(x).length === 0;
  }

  return x !== 0 && !x;
};

interface Options<T = unknown> {
  /**
   * A function who's return value, when true, will
   * keep the latest truthy value as the "return value"
   * (as determined by the `value` option's return value)
   */
  when: () => boolean;

  /**
   * A function who's return value will be used as the value
   * of this resource.
   */
  value: () => T;
}

export function remoteData<T = unknown>(
  { on }: Hooks,
  endpoint: string,
  options: FetchOptions = {}
): State {
  let state = new State();
  let controller = new AbortController();

  on.cleanup(() => controller.abort());

  let nodes_promise = fetch(
    `${BASE_URL}/nodes/${endpoint}/`,
    { signal: controller.signal, ...options }
  )
  .then((response) => {
    state.status = response.status;

    return response.json();
  });

  let breadcrumb_promise = fetch(
    `${BASE_URL}/folders/${endpoint}/`,
    { signal: controller.signal, ...options }
  )
  .then((response) => {
    state.status = response.status;

    return response.json();
  });

  Promise.all([nodes_promise, breadcrumb_promise])
  .then(result => {
    let node_items = result[0].data ?? [];
    state.value = new TrackedObject({
      nodes: node_items.map((item: IBaseTreeNode) => new BaseTreeNode(item)),
      breadcrumb: result[1].data.attributes.breadcrumb ?? []
    });
  }).catch((error) => {
    state.error = error;
  })

  return state;
}

export function RemoteData(endpoint: string, options?: FetchOptions): State;
export function RemoteData(
  endpoint: string | (() => string) | (() => { endpoint: string } & FetchOptions),
  opts?: FetchOptions
): State {
  return resource((hooks) => {
    let result = typeof endpoint === 'string' ? endpoint : endpoint();
    let targetUrl: string;
    let options: FetchOptions = {};

    if (typeof result === 'string') {
      targetUrl = result;
    } else {
      let { endpoint, ...opts } = result;

      targetUrl = endpoint;
      options = opts;
    }

    if (opts) {
      options = { ...options, ...opts };
    }
    return remoteData<NodesWithBreadcrumb>(hooks, targetUrl, options);
  });
}

resourceFactory(RemoteData);

export function keepLatest<Return = unknown>({ when, value: valueFn }: Options<Return>) {
  return resource(() => {
    let previous: Return | undefined;

    return () => {
      let value = valueFn();

      if (when()) {
        if (isEmpty(value)) {
          return previous;
        } else {
          previous = value;
          return previous;
        }
      }

      previous = value;
      return previous;
    };
  });
}

resourceFactory(keepLatest);
