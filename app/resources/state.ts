import { tracked } from '@glimmer/tracking';


export class State<T = unknown> {
    /**
     * If an exception was thrown while making the request, the error
     * thrown will be here.
     */
    @tracked error: Error | null = null;
    /**
     * The resolved value of the fetch request
     */
    @tracked value: T | null = null;

    /**
     * HTTP status code.
     */
    @tracked status: null | number = null;

    /**
     * true if the request has finished
     */
    get isResolved() {
      return Boolean(this.value) || Boolean(this.error);
    }

    /**
     * Alias for isLoading
     */
    get isPending() {
      return this.isLoading;
    }

    /**
     * true if the fetch request is in progress
     */
    get isLoading() {
      return !this.isResolved;
    }

    /**
     * true if the request throws an exception
     */
    get isError() {
      return Boolean(this.error);
    }
  }
