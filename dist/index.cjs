var react = require('react');
var jsxRuntime = require('react/jsx-runtime');

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

function _catch(body, recover) {
  try {
    var result = body();
  } catch (e) {
    return recover(e);
  }
  if (result && result.then) {
    return result.then(void 0, recover);
  }
  return result;
}
var DEFAULT_OPTIONS = {
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
function _finallyRethrows(body, finalizer) {
  try {
    var result = body();
  } catch (e) {
    return finalizer(true, e);
  }
  if (result && result.then) {
    return result.then(finalizer.bind(null, false), finalizer.bind(null, true));
  }
  return finalizer(false, result);
}
var dispatchers = {
  actions: {}
};
var cache = {
  current: {}
};
var cacheTimeout = null;
/**
 * @param {string} [message=""]
 * @param {boolean} [isDebuggerActivated=false]
 * @param {boolean} [isError=false]
 * @param {null|string|Error} [error=null]
 */
var logDebugger = function logDebugger(message, isDebuggerActivated, isError, error) {
  if (message === void 0) {
    message = "";
  }
  if (isDebuggerActivated === void 0) {
    isDebuggerActivated = false;
  }
  if (isError === void 0) {
    isError = false;
  }
  if (error === void 0) {
    error = null;
  }
  if (isError) {
    if (isDebuggerActivated) console.error("[USE_QUERY]: " + message + " - " + new Date().toLocaleTimeString(), error);
  } else {
    if (isDebuggerActivated) console.log("[USE_QUERY]: " + message + " - " + new Date().toLocaleTimeString());
  }
};
/**
 * @param {DefaultUseQueryOptions} options
 * @returns {boolean}
 */
var validateOptions = function validateOptions(options) {
  var keys = Object.keys(DEFAULT_OPTIONS);
  var _keys = Object.keys(options);
  var symDifference = _keys.filter(function (item) {
    return !keys.includes(item);
  });
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
    logDebugger("Validation error", true, true, new Error("Found not valid option" + (symDifference.length > 1 ? "s" : "") + ": \"" + symDifference.join('", "') + "\"."));
    return false;
  }
  return true;
};
/**
 * @param {DefaultUseQueryOptions} options
 * @param {MutableRefObject} cache
 */
var timeoutCacheClear = function timeoutCacheClear(options, cache) {
  if (options.cacheTimeout && options.cacheTimeout > 0) {
    logDebugger("Cache clear timeout start: " + options.cacheTimeout / 1000 + " seconds.", options.isDebuggerActivated);
    window.clearTimeout(cacheTimeout);
    cacheTimeout = window.setTimeout(function () {
      cache.current = {};
      logDebugger("Cache cleared", options.isDebuggerActivated);
    }, options.cacheTimeout);
  }
};
/**
 * Creates a store with the provided initial state.
 * @param {object} initialState - The initial state object for the store.
 * @returns {CreateStoreReturn} An object representing the created store.
 */
var createQueryStore = function createQueryStore(initialState) {
  Object.entries(initialState).forEach(function (_ref) {
    var key = _ref[0],
      value = _ref[1];
    cache.current[key] = value;
  });
  return {
    __value: initialState
  };
};
var QueryContext = /*#__PURE__*/react.createContext(null);
var QueryProvider = function QueryProvider(_ref2) {
  var children = _ref2.children,
    store = _ref2.store,
    _dispatchers = _ref2.dispatchers;
  if (store && !store.__value) throw new Error("`store` must be a valid QueryStore data, use `createQueryStore` function to create it");
  if (_dispatchers && !Array.isArray(_dispatchers)) {
    throw new Error("`dispatchers` must be a valid array of dispatchers, use `createDispatcher` function to generate them");
  } else {
    _dispatchers.forEach(function (_ref3) {
      var _extends2;
      var name = _ref3.name,
        actions = _ref3.actions;
      dispatchers.actions = _extends({}, dispatchers.actions, (_extends2 = {}, _extends2[name] = _extends({}, dispatchers.actions[name], actions), _extends2));
    });
  }
  var _useState = react.useState(store ? store.__value : null),
    state = _useState[0],
    setState = _useState[1];
  return (
    /*#__PURE__*/
    // @ts-ignore
    jsxRuntime.jsx(QueryContext.Provider, {
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
var createQueryDispatcher = function createQueryDispatcher(dispatcherOptions) {
  var actions = {};
  Object.entries(dispatcherOptions.actions).forEach(function (_ref4) {
    var actionName = _ref4[0],
      actionFn = _ref4[1];
    actions[actionName] = function (data, setData) {
      return function (payload) {
        var _data = _extends({}, data)[dispatcherOptions.name];
        actionFn(_data, payload);
        setData(_extends({}, data, _data));
      };
    };
  });
  return {
    name: dispatcherOptions.name,
    actions: actions
  };
};
/**
 * Custom hook for accessing dispatcher actions associated with a specific name.
 * @param {string} name - The name of the dispatcher to retrieve actions for.
 * @returns {Object} An object containing the actions associated with the specified dispatcher name.
 */
var useQueryDispatcher = function useQueryDispatcher(name) {
  // @ts-ignore
  var _useContext = react.useContext(QueryContext),
    data = _useContext[0],
    setData = _useContext[1];
  var actions = {};
  Object.entries(dispatchers.actions[name]).forEach(function (_ref5) {
    var actionName = _ref5[0],
      actionFn = _ref5[1];
    // @ts-ignore
    actions[actionName] = function (payload) {
      return actionFn(data, setData)(payload);
    };
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
var useQueryState = function useQueryState(name) {
  if (name === void 0) {
    name = undefined;
  }
  // @ts-ignore
  var _useContext2 = react.useContext(QueryContext),
    data = _useContext2[0],
    setData = _useContext2[1];
  if (name) {
    return [data ? data[name] : data, function (value) {
      setData(function (prev) {
        var _extends3;
        return _extends({}, prev, (_extends3 = {}, _extends3[name] = value, _extends3));
      });
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
var useQuerySelector = function useQuerySelector(callbackSelector) {
  if (callbackSelector === void 0) {
    callbackSelector = function callbackSelector(state) {};
  }
  // @ts-ignore
  var _useContext3 = react.useContext(QueryContext),
    data = _useContext3[0];
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
var useQuery = function useQuery(url, options) {
  if (options === void 0) {
    options = _extends({}, DEFAULT_OPTIONS);
  }
  var _DEFAULT_OPTIONS$opti = _extends({}, DEFAULT_OPTIONS, options),
    name = _DEFAULT_OPTIONS$opti.name,
    selector = _DEFAULT_OPTIONS$opti.selector,
    pick = _DEFAULT_OPTIONS$opti.pick,
    transform = _DEFAULT_OPTIONS$opti.transform,
    method = _DEFAULT_OPTIONS$opti.method,
    headers = _DEFAULT_OPTIONS$opti.headers,
    body = _DEFAULT_OPTIONS$opti.body,
    isDebuggerActivated = _DEFAULT_OPTIONS$opti.isDebuggerActivated;
  validateOptions(_extends({}, DEFAULT_OPTIONS, options));
  // const cache = useRef({});
  var _useQueryState = useQueryState(name),
    data = _useQueryState[0],
    setData = _useQueryState[1];
  var _useState2 = react.useState(null),
    error = _useState2[0],
    setError = _useState2[1];
  var _useState3 = react.useState(false),
    loading = _useState3[0],
    setLoading = _useState3[1];
  var fetchData = function fetchData() {
    try {
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
        return Promise.resolve();
      }
      var _temp = _finallyRethrows(function () {
        return _catch(function () {
          logDebugger("No data found in cache, proceed to do a new request...", isDebuggerActivated);
          // @ts-ignore
          return Promise.resolve(fetch(url, {
            method: method,
            headers: headers,
            body: body
          })).then(function (response) {
            return Promise.resolve(response.json()).then(function (result) {
              if (response.ok) {
                var _result = selector ? result[selector] : result;
                if (typeof transform === "function") logDebugger("transform data before saving", isDebuggerActivated);
                var _transformedData = typeof transform === "function" ? transform(_result) : _result;
                if (typeof pick === "function" || Array.isArray(pick)) {
                  logDebugger("pick data before saving", isDebuggerActivated);
                  // @ts-ignore
                  _transformedData = JSON.parse(JSON.stringify(_transformedData, pick));
                }
                setData(_transformedData);
                logDebugger("Request done", isDebuggerActivated);
                cache.current[url] = _transformedData;
                timeoutCacheClear(options, cache);
                logDebugger("New data saved on cache for: \"" + url + "\"", isDebuggerActivated);
              } else {
                setError(result);
                logDebugger("An error occurred", isDebuggerActivated, true, result);
              }
            });
          });
        }, function (err) {
          setError(err);
          logDebugger("An error occurred", isDebuggerActivated, true, err);
        });
      }, function (_wasThrown, _result2) {
        setLoading(false);
        logDebugger("Data seatled, process done", isDebuggerActivated);
        if (_wasThrown) throw _result2;
        return _result2;
      });
      return Promise.resolve(_temp && _temp.then ? _temp.then(function () {}) : void 0);
    } catch (e) {
      return Promise.reject(e);
    }
  };
  react.useEffect(function () {
    fetchData();
  }, [url]);
  return {
    data: data,
    error: error,
    loading: loading,
    mutate: setData,
    refresh: fetchData,
    cache: {
      get: function get(url) {
        return url ? cache.current[url] : cache.current;
      },
      has: function has(url) {
        return cache.current[url];
      },
      clear: function clear() {
        cache.current = {};
        logDebugger("Cache cleared", isDebuggerActivated);
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
var useQueryEvent = function useQueryEvent(url, options) {
  if (options === void 0) {
    options = _extends({}, DEFAULT_OPTIONS);
  }
  var _useState4 = react.useState(false),
    isSending = _useState4[0],
    setIsSending = _useState4[1];
  var _DEFAULT_OPTIONS$opti2 = _extends({}, DEFAULT_OPTIONS, options),
    name = _DEFAULT_OPTIONS$opti2.name,
    selector = _DEFAULT_OPTIONS$opti2.selector,
    pick = _DEFAULT_OPTIONS$opti2.pick,
    transform = _DEFAULT_OPTIONS$opti2.transform,
    method = _DEFAULT_OPTIONS$opti2.method,
    headers = _DEFAULT_OPTIONS$opti2.headers,
    body = _DEFAULT_OPTIONS$opti2.body,
    isDebuggerActivated = _DEFAULT_OPTIONS$opti2.isDebuggerActivated;
  validateOptions(_extends({}, DEFAULT_OPTIONS, options));
  // const cache = useRef({});
  var _useQueryState2 = useQueryState(name),
    data = _useQueryState2[0],
    setData = _useQueryState2[1];
  var _useState5 = react.useState(null),
    error = _useState5[0],
    setError = _useState5[1];
  var _useState6 = react.useState(false),
    loading = _useState6[0],
    setLoading = _useState6[1];
  var fetchData = function fetchData() {
    try {
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
        return Promise.resolve();
      }
      var _temp2 = _finallyRethrows(function () {
        return _catch(function () {
          logDebugger("No data found in cache, proceed to do a new request...", isDebuggerActivated);
          // @ts-ignore
          return Promise.resolve(fetch(url, {
            method: method,
            headers: headers,
            data: body
          })).then(function (response) {
            return Promise.resolve(response.json()).then(function (result) {
              if (response.ok) {
                var _result = selector ? result[selector] : result;
                if (typeof transform === "function") logDebugger("transform data before saving", isDebuggerActivated);
                var _transformedData = typeof transform === "function" ? transform(_result) : _result;
                if (typeof pick === "function" || Array.isArray(pick)) {
                  logDebugger("pick data before saving", isDebuggerActivated);
                  // @ts-ignore
                  _transformedData = JSON.parse(JSON.stringify(_transformedData, pick));
                }
                setData(_transformedData);
                logDebugger("Request done", isDebuggerActivated);
                cache.current[url] = _transformedData;
                timeoutCacheClear(options, cache);
                logDebugger("New data saved on cache for: \"" + url + "\"", isDebuggerActivated);
              } else {
                setError(result);
                logDebugger("An error occurred", isDebuggerActivated, true, result);
              }
            });
          });
        }, function (err) {
          setError(err);
          logDebugger("An error occurred", isDebuggerActivated, true, err);
        });
      }, function (_wasThrown2, _result3) {
        setLoading(false);
        logDebugger("Data seatled, process done", isDebuggerActivated);
        if (_wasThrown2) throw _result3;
        return _result3;
      });
      return Promise.resolve(_temp2 && _temp2.then ? _temp2.then(function () {}) : void 0);
    } catch (e) {
      return Promise.reject(e);
    }
  };
  var sendRequest = react.useCallback(function () {
    try {
      // don't send again while we are sending
      if (isSending) return Promise.resolve();
      // update state
      setIsSending(true);
      // send the actual request
      return Promise.resolve(fetchData()).then(function () {
        // once the request is sent, update state again
        setIsSending(false);
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }, [isSending, url]); // update the callback if the state changes
  return {
    sendRequest: sendRequest,
    isSending: isSending,
    data: data,
    error: error,
    loading: loading,
    mutate: setData,
    refresh: fetchData,
    cache: {
      get: function get(url) {
        return url ? cache.current[url] : cache.current;
      },
      has: function has(url) {
        return cache.current[url];
      },
      clear: function clear() {
        cache.current = {};
        logDebugger("Cache cleared", isDebuggerActivated);
      }
    }
  };
};

exports.QueryProvider = QueryProvider;
exports.createQueryDispatcher = createQueryDispatcher;
exports.createQueryStore = createQueryStore;
exports.useQuery = useQuery;
exports.useQueryDispatcher = useQueryDispatcher;
exports.useQueryEvent = useQueryEvent;
exports.useQuerySelector = useQuerySelector;
exports.useQueryState = useQueryState;
//# sourceMappingURL=index.cjs.map
