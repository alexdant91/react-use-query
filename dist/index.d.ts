import { Dispatch, SetStateAction } from 'react';
interface QueryResultCacheFn {
    get: Function;
    has: Function;
    clear: Function;
}
interface QueryResult {
    data: any;
    error: Error | false | null;
    loading: boolean;
    mutate: Function;
    refresh: Function;
    cache: QueryResultCacheFn;
}
interface QueryEventResult {
    sendRequest: Function;
    isSending: boolean;
    data: any;
    error: Error | false | null;
    loading: boolean;
    mutate: Function;
    refresh: Function;
    cache: QueryResultCacheFn;
}
interface DefaultUseQueryOptions {
    name?: string;
    selector?: string;
    pick?: Array<any> | Function;
    transform?: Function;
    method?: string;
    headers?: object;
    body?: any;
    isDebuggerActivated?: boolean;
    cacheTimeout?: number;
}
interface CreateStoreReturn {
    __value: object;
}
type DispatcherOptions = {
    name: string;
    actions: object;
};
/**
 * Creates a store with the provided initial state.
 * @param {object} initialState - The initial state object for the store.
 * @returns {CreateStoreReturn} An object representing the created store.
 */
export declare const createQueryStore: (initialState: object) => CreateStoreReturn;
export declare const QueryProvider: ({ children, store, dispatchers: _dispatchers }: {
    children: any;
    store: any;
    dispatchers: any;
}) => any;
/**
 * Creates a dispatcher object with specified actions for managing state updates.
 * @param {DispatcherOptions} dispatcherOptions - Options for configuring the dispatcher.
 * @returns {DispatcherObject} An object representing the created dispatcher.
 */
export declare const createQueryDispatcher: (dispatcherOptions: DispatcherOptions) => {
    name: string;
    actions: {};
};
/**
 * Custom hook for accessing dispatcher actions associated with a specific name.
 * @param {string} name - The name of the dispatcher to retrieve actions for.
 * @returns {Object} An object containing the actions associated with the specified dispatcher name.
 */
export declare const useQueryDispatcher: (name: string) => {};
/**
 * Custom hook for accessing and updating query state from the QueryContext.
 * @param {string} [name=undefined] - The name of the specific state to access within the query data.
 * @returns {[S, Dispatch<SetStateAction<S>>]} An array containing the queried state and a function to update the state.
 *                 If `name` is provided, it returns the specified state and a function to update that state.
 *                 If `name` is not provided, it returns the entire query data and a function to update it.
 */
export declare const useQueryState: (name?: string | undefined) => [any, Dispatch<SetStateAction<any>>];
/**
 * Custom hook for querying data from the QueryContext and applying a callback selector.
 * @param {function} [callbackSelector] - The callback function to apply as a selector on the data.
 * @returns {*} The result of applying the callback selector on the data from the QueryContext.
 */
export declare const useQuerySelector: (callbackSelector?: Function) => any;
/**
 * Use query hook that manage requests, cache and other features.
 * @param {string} url
 * @param {object} options
 * @param {string} [options.name] Name must be a string. It should contains data state name.
 * @param {string} [options.selector] Selector must be a string. It should contains key value to select from result object.
 * @param {string} [options.pick] Pick must be a function or an array of string. It rappresent the function or the array to pick just a portion of data.
 * @param {function} [options.transform] Transform must be a function. It rappresent the funcion to transform data before saving on state. If you need to mutate data, use `mutate` function instead
 * @param {string} [options.method] Method must be a string. It should be one of "GET", "POST", "PUT", "PATCH", "DELETE".
 * @param {object} [options.headers] Headers must be an object. It should contains request headers key value.
 * @param {*} [options.body]
 * @param {boolean} [options.isDebuggerActivated] isDebuggerActivated must be a boolean. It should be activated if you need to debug all process.
 * @param {number} [options.cacheTimeout] cacheTimeout must be a number. It rappresent the timeout to remove cached data from memory in milliseconds.
 * @returns {QueryResult}
 */
export declare const useQuery: (url: string, options?: DefaultUseQueryOptions) => QueryResult;
/**
 * Use query hook that manage requests, cache and other features with an event like "click"
 * @param {string} url
 * @param {object} options
 * @param {string} [options.name] Name must be a string. It should contains data state name.
 * @param {string} [options.selector] Selector must be a string. It should contains key value to select from result object.
 * @param {string} [options.pick] Pick must be a function or an array of string. It rappresent the function or the array to pick just a portion of data.
 * @param {function} [options.transform] Transform must be a function. It rappresent the funcion to transform data before saving on state. If you need to mutate data, use `mutate` function instead
 * @param {string} [options.method] Method must be a string. It should be one of "GET", "POST", "PUT", "PATCH", "DELETE".
 * @param {object} [options.headers] Headers must be an object. It should contains request headers key value.
 * @param {*} [options.body]
 * @param {boolean} [options.isDebuggerActivated] isDebuggerActivated must be a boolean. It should be activated if you need to debug all process.
 * @param {number} [options.cacheTimeout] cacheTimeout must be a number. It rappresent the timeout to remove cached data from memory in milliseconds.
 * @returns {QueryEventResult}
 */
export declare const useQueryEvent: (url: string, options?: DefaultUseQueryOptions) => QueryEventResult;
export {};
