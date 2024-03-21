import { useState, useContext, useEffect, useCallback, createContext } from 'react';
import { jsx } from 'react/jsx-runtime';

function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}

const DEFAULT_OPTIONS = {
  name: undefined,
  selector: undefined,
  transform: undefined,
  pick: undefined,
  method: "GET",
  headers: undefined,
  body: undefined,
  isDebuggerActivated: false,
  cacheTimeout: 0
};
const dispatchers = {
  actions: {}
};
const cache = {
  current: {}
};
let cacheTimeout = null;
/**
 * @param {string} [message=""]
 * @param {boolean} [isDebuggerActivated=false]
 * @param {boolean} [isError=false]
 * @param {null|string|Error} [error=null]
 */
const logDebugger = (message = "", isDebuggerActivated = false, isError = false, error = null) => {
  if (isError) {
    if (isDebuggerActivated) console.error(`[USE_QUERY]: ${message} - ${new Date().toLocaleTimeString()}`, error);
  } else {
    if (isDebuggerActivated) console.log(`[USE_QUERY]: ${message} - ${new Date().toLocaleTimeString()}`);
  }
};
/**
 * @param {DefaultUseQueryOptions} options
 * @returns {boolean}
 */
const validateOptions = options => {
  const keys = Object.keys(DEFAULT_OPTIONS);
  const _keys = Object.keys(options);
  const symDifference = _keys.filter(item => !keys.includes(item));
  if (options.selector !== undefined && typeof options.selector !== "string") {
    logDebugger("Validation error for `options.selector`", options.isDebuggerActivated, true, new Error("Selector must be a string. It should contains key value to select from result object."));
    return false;
  } else if (options.name !== undefined && typeof options.name !== "string") {
    logDebugger("Validation error for `options.name`", options.isDebuggerActivated, true, new Error("Name must be a string. It should contains data name to retrieve it from state."));
    return false;
  } else if (options.method !== undefined && (typeof options.method !== "string" || ["GET", "POST", "PUT", "PATCH", "DELETE"].indexOf(options.method.toUpperCase()) === -1)) {
    logDebugger("Validation error for `options.method`", options.isDebuggerActivated, true, new Error('Method must be a string. It should be one of "GET", "POST", "PUT", "PATCH", "DELETE".'));
    return false;
  } else if (options.headers !== undefined && typeof options.headers !== "object" && Array.isArray(options.headers)) {
    logDebugger("Validation error for `options.headers`", options.isDebuggerActivated, true, new Error("Headers must be an object. It should contains request headers key value."));
    return false;
  } else if (options.isDebuggerActivated !== undefined && typeof options.isDebuggerActivated !== "boolean" && Array.isArray(options.headers)) {
    logDebugger("Validation error for `options.isDebuggerActivated`", true, true, new Error("isDebuggerActivated must be a boolean. It should be activated if you need to debug all process."));
    return false;
  } else if (options.transform !== undefined && typeof options.transform !== "function") {
    logDebugger("Validation error for `options.transform`", true, true, new Error("transform must be a function. It rappresent the function to transform data before saving on state."));
    return false;
  } else if (options.pick !== undefined && typeof options.pick !== "function" && !Array.isArray(options.pick)) {
    logDebugger("Validation error for `options.pick`", true, true, new Error("pick must be a function or an array. It rappresent the function or the array to pick just a portion of data."));
    return false;
  } else if (options.cacheTimeout !== undefined && typeof options.cacheTimeout !== "number") {
    logDebugger("Validation error for `options.cacheTimeout`", true, true, new Error("cacheTimeout must be a number. It rappresent the timeout to remove cached data from memory in milliseconds."));
    return false;
  }
  if (symDifference.length > 0) {
    logDebugger("Validation error", true, true, new Error(`Found not valid option${symDifference.length > 1 ? "s" : ""}: "${symDifference.join('", "')}".`));
    return false;
  }
  return true;
};
/**
 * @param {DefaultUseQueryOptions} options
 * @param {MutableRefObject} cache
 */
const timeoutCacheClear = (options, cache) => {
  if (options.cacheTimeout && options.cacheTimeout > 0) {
    logDebugger(`Cache clear timeout start: ${options.cacheTimeout / 1000} seconds.`, options.isDebuggerActivated);
    window.clearTimeout(cacheTimeout);
    cacheTimeout = window.setTimeout(() => {
      cache.current = {};
      logDebugger(`Cache cleared`, options.isDebuggerActivated);
    }, options.cacheTimeout);
  }
};
/**
 * Creates a store with the provided initial state.
 * @param {object} initialState - The initial state object for the store.
 * @returns {CreateStoreReturn} An object representing the created store.
 */
const createQueryStore = initialState => {
  Object.entries(initialState).forEach(([key, value]) => {
    cache.current[key] = value;
  });
  return {
    __value: initialState
  };
};
const QueryContext = /*#__PURE__*/createContext(null);
const QueryProvider = ({
  children,
  store,
  dispatchers: _dispatchers
}) => {
  if (store && !store.__value) throw new Error("`store` must be a valid QueryStore data, use `createQueryStore` function to create it");
  if (_dispatchers && !Array.isArray(_dispatchers)) {
    throw new Error("`dispatchers` must be a valid array of dispatchers, use `createDispatcher` function to generate them");
  } else {
    _dispatchers.forEach(({
      name,
      actions
    }) => {
      dispatchers.actions = _extends({}, dispatchers.actions, {
        [name]: _extends({}, dispatchers.actions[name], actions)
      });
    });
  }
  const [state, setState] = useState(store ? store.__value : null);
  return (
    /*#__PURE__*/
    // @ts-ignore
    jsx(QueryContext.Provider, {
      value: [state, setState],
      children: children
    })
  );
};
/**
 * Creates a dispatcher object with specified actions for managing state updates.
 * @param {DispatcherOptions} dispatcherOptions - Options for configuring the dispatcher.
 * @returns {DispatcherObject} An object representing the created dispatcher.
 */
const createQueryDispatcher = dispatcherOptions => {
  const actions = {};
  Object.entries(dispatcherOptions.actions).forEach(([actionName, actionFn]) => {
    actions[actionName] = (data, setData) => payload => {
      const _data = _extends({}, data)[dispatcherOptions.name];
      actionFn(_data, payload);
      setData(_extends({}, data, _data));
    };
  });
  return {
    name: dispatcherOptions.name,
    actions
  };
};
/**
 * Custom hook for accessing dispatcher actions associated with a specific name.
 * @param {string} name - The name of the dispatcher to retrieve actions for.
 * @returns {Object} An object containing the actions associated with the specified dispatcher name.
 */
const useQueryDispatcher = name => {
  // @ts-ignore
  const [data, setData] = useContext(QueryContext);
  const actions = {};
  Object.entries(dispatchers.actions[name]).forEach(([actionName, actionFn]) => {
    // @ts-ignore
    actions[actionName] = payload => actionFn(data, setData)(payload);
  });
  return actions;
};
/**
 * Custom hook for accessing and updating query state from the QueryContext.
 * @param {string} [name=undefined] - The name of the specific state to access within the query data.
 * @returns {[S, Dispatch<SetStateAction<S>>]} An array containing the queried state and a function to update the state.
 *                 If `name` is provided, it returns the specified state and a function to update that state.
 *                 If `name` is not provided, it returns the entire query data and a function to update it.
 */
const useQueryState = (name = undefined) => {
  // @ts-ignore
  const [data, setData] = useContext(QueryContext);
  if (name) {
    return [data ? data[name] : data, value => {
      setData(prev => _extends({}, prev, {
        [name]: value
      }));
      cache.current[name] = value;
    }];
  } else {
    return [data, setData];
  }
};
/**
 * Custom hook for querying data from the QueryContext and applying a callback selector.
 * @param {function} [callbackSelector] - The callback function to apply as a selector on the data.
 * @returns {*} The result of applying the callback selector on the data from the QueryContext.
 */
const useQuerySelector = (callbackSelector = state => {}) => {
  // @ts-ignore
  const [data] = useContext(QueryContext);
  return callbackSelector(data);
};
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
const useQuery = (url, options = _extends({}, DEFAULT_OPTIONS)) => {
  const {
    name,
    selector,
    pick,
    transform,
    method,
    headers,
    body,
    isDebuggerActivated
  } = _extends({}, DEFAULT_OPTIONS, options);
  validateOptions(_extends({}, DEFAULT_OPTIONS, options));
  // const cache = useRef({});
  const [data, setData] = useQueryState(name);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const fetchData = async () => {
    logDebugger("Fetching data...", isDebuggerActivated);
    if (error) setError(null);
    if (!loading) setLoading(true);
    if (cache.current[url]) {
      logDebugger("Get data from cache, no need a new request", isDebuggerActivated);
      if (typeof transform === "function") logDebugger("transform data before saving", isDebuggerActivated);
      if (typeof pick === "function" || Array.isArray(pick)) logDebugger("pick data before saving", isDebuggerActivated);
      setData(cache.current[url]);
      timeoutCacheClear(options, cache);
      setLoading(false);
      return;
    }
    try {
      logDebugger("No data found in cache, proceed to do a new request...", isDebuggerActivated);
      // @ts-ignore
      const response = await fetch(url, {
        method,
        headers,
        body
      });
      const result = await response.json();
      if (response.ok) {
        const _result = selector ? result[selector] : result;
        if (typeof transform === "function") logDebugger("transform data before saving", isDebuggerActivated);
        let _transformedData = typeof transform === "function" ? transform(_result) : _result;
        if (typeof pick === "function" || Array.isArray(pick)) {
          logDebugger("pick data before saving", isDebuggerActivated);
          // @ts-ignore
          _transformedData = JSON.parse(JSON.stringify(_transformedData, pick));
        }
        setData(_transformedData);
        logDebugger("Request done", isDebuggerActivated);
        cache.current[url] = _transformedData;
        timeoutCacheClear(options, cache);
        logDebugger(`New data saved on cache for: "${url}"`, isDebuggerActivated);
      } else {
        setError(result);
        logDebugger("An error occurred", isDebuggerActivated, true, result);
      }
    } catch (err) {
      setError(err);
      logDebugger("An error occurred", isDebuggerActivated, true, err);
    } finally {
      setLoading(false);
      logDebugger("Data seatled, process done", isDebuggerActivated);
    }
  };
  useEffect(() => {
    fetchData();
  }, [url]);
  return {
    data,
    error,
    loading,
    mutate: setData,
    refresh: fetchData,
    cache: {
      get: url => {
        return url ? cache.current[url] : cache.current;
      },
      has: url => {
        return cache.current[url];
      },
      clear: () => {
        cache.current = {};
        logDebugger(`Cache cleared`, isDebuggerActivated);
      }
    }
  };
};
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
const useQueryEvent = (url, options = _extends({}, DEFAULT_OPTIONS)) => {
  const [isSending, setIsSending] = useState(false);
  const {
    name,
    selector,
    pick,
    transform,
    method,
    headers,
    body,
    isDebuggerActivated
  } = _extends({}, DEFAULT_OPTIONS, options);
  validateOptions(_extends({}, DEFAULT_OPTIONS, options));
  // const cache = useRef({});
  const [data, setData] = useQueryState(name);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const fetchData = async () => {
    logDebugger("Fetching data...", isDebuggerActivated);
    if (error) setError(null);
    if (!loading) setLoading(true);
    if (cache.current[url]) {
      logDebugger("Get data from cache, no need a new request", isDebuggerActivated);
      if (typeof transform === "function") logDebugger("transform data before saving", isDebuggerActivated);
      if (typeof pick === "function" || Array.isArray(pick)) logDebugger("pick data before saving", isDebuggerActivated);
      setData(cache.current[url]);
      timeoutCacheClear(options, cache);
      setLoading(false);
      return;
    }
    try {
      logDebugger("No data found in cache, proceed to do a new request...", isDebuggerActivated);
      // @ts-ignore
      const response = await fetch(url, {
        method,
        headers,
        data: body
      });
      const result = await response.json();
      if (response.ok) {
        const _result = selector ? result[selector] : result;
        if (typeof transform === "function") logDebugger("transform data before saving", isDebuggerActivated);
        let _transformedData = typeof transform === "function" ? transform(_result) : _result;
        if (typeof pick === "function" || Array.isArray(pick)) {
          logDebugger("pick data before saving", isDebuggerActivated);
          // @ts-ignore
          _transformedData = JSON.parse(JSON.stringify(_transformedData, pick));
        }
        setData(_transformedData);
        logDebugger("Request done", isDebuggerActivated);
        cache.current[url] = _transformedData;
        timeoutCacheClear(options, cache);
        logDebugger(`New data saved on cache for: "${url}"`, isDebuggerActivated);
      } else {
        setError(result);
        logDebugger("An error occurred", isDebuggerActivated, true, result);
      }
    } catch (err) {
      setError(err);
      logDebugger("An error occurred", isDebuggerActivated, true, err);
    } finally {
      setLoading(false);
      logDebugger("Data seatled, process done", isDebuggerActivated);
    }
  };
  const sendRequest = useCallback(async () => {
    // don't send again while we are sending
    if (isSending) return;
    // update state
    setIsSending(true);
    // send the actual request
    await fetchData();
    // once the request is sent, update state again
    setIsSending(false);
  }, [isSending, url]); // update the callback if the state changes
  return {
    sendRequest,
    isSending,
    data,
    error,
    loading,
    mutate: setData,
    refresh: fetchData,
    cache: {
      get: url => {
        return url ? cache.current[url] : cache.current;
      },
      has: url => {
        return cache.current[url];
      },
      clear: () => {
        cache.current = {};
        logDebugger(`Cache cleared`, isDebuggerActivated);
      }
    }
  };
};

export { QueryProvider, createQueryDispatcher, createQueryStore, useQuery, useQueryDispatcher, useQueryEvent, useQuerySelector, useQueryState };
//# sourceMappingURL=index.modern.tsx.map
