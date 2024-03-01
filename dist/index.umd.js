(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react'), require('react/jsx-runtime')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react', 'react/jsx-runtime'], factory) :
  (global = global || self, factory(global.useQueryManager = {}, global.react, global.jsx));
})(this, (function (exports, react, jsxRuntime) {
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
    selector: undefined,
    manipulate: undefined,
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
      logDebugger("Validation error for `options.selector`", isDebuggerActivated, true, new Error("Selector must be a string. It should contains key value to select from result object."));
      return false;
    } else if (options.method !== undefined && (typeof options.method !== "string" || ["GET", "POST", "PUT", "PATCH", "DELETE"].indexOf(options.method.toUpperCase()) === -1)) {
      logDebugger("Validation error for `options.method`", isDebuggerActivated, true, new Error('Method must be a string. It should be one of "GET", "POST", "PUT", "PATCH", "DELETE".'));
      return false;
    } else if (options.headers !== undefined && typeof options.headers !== "object" && Array.isArray(options.headers)) {
      logDebugger("Validation error for `options.headers`", isDebuggerActivated, true, new Error("Headers must be an object. It should contains request headers key value."));
      return false;
    } else if (options.isDebuggerActivated !== undefined && typeof options.isDebuggerActivated !== "boolean" && Array.isArray(options.headers)) {
      logDebugger("Validation error for `options.isDebuggerActivated`", true, true, new Error("isDebuggerActivated must be a boolean. It should be activated if you need to debug all process."));
      return false;
    } else if (options.manipulate !== undefined && typeof options.manipulate !== "function") {
      logDebugger("Validation error for `options.manipulate`", true, true, new Error("manipulate must be a function. It rappresent the funcion to manipulate data before saving on state."));
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
      clearTimeout(cacheTimeout);
      cacheTimeout = setTimeout(function () {
        cache.current = {};
        logDebugger("Cache cleared", options.isDebuggerActivated);
      }, options.cacheTimeout);
    }
  };
  var QueryContext = /*#__PURE__*/react.createContext(null);
  var QueryProvider = function QueryProvider(_ref) {
    var children = _ref.children;
    var _useState = react.useState(null),
      state = _useState[0],
      setState = _useState[1];
    return /*#__PURE__*/jsxRuntime.jsx(QueryContext.Provider, {
      value: [state, setState],
      children: children
    });
  };
  var useQueryContext = function useQueryContext() {
    return react.useContext(QueryContext);
  };

  /**
   * Use query hook that manage requests, cache and other features.
   * @param {string} url 
   * @param {object} options
   * @param {string} [options.selector] Selector must be a string. It should contains key value to select from result object.
   * @param {function} [options.manipulate] manipulate must be a function. It rappresent the funcion to manipulate data before saving on state. If you need to mutate data, use `mutate` function instead
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
      selector = _DEFAULT_OPTIONS$opti.selector,
      manipulate = _DEFAULT_OPTIONS$opti.manipulate,
      method = _DEFAULT_OPTIONS$opti.method,
      headers = _DEFAULT_OPTIONS$opti.headers,
      body = _DEFAULT_OPTIONS$opti.body,
      isDebuggerActivated = _DEFAULT_OPTIONS$opti.isDebuggerActivated;
    validateOptions(_extends({}, DEFAULT_OPTIONS, options));
    var cache = react.useRef({});
    var _useQueryContext = useQueryContext(),
      data = _useQueryContext[0],
      setData = _useQueryContext[1];
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
          if (typeof manipulate === "function") logDebugger("Manipulate data before saving", isDebuggerActivated);
          setData(cache.current[url]);
          timeoutCacheClear(options, cache);
          setLoading(false);
          return Promise.resolve();
        }
        var _temp = _finallyRethrows(function () {
          return _catch(function () {
            logDebugger("No data found in cache, proceed to do a new request...", isDebuggerActivated);
            return Promise.resolve(fetch(url, {
              method: method,
              headers: headers,
              data: body
            })).then(function (response) {
              return Promise.resolve(response.json()).then(function (result) {
                if (response.ok) {
                  var _result = selector ? result[selector] : result;
                  if (typeof manipulate === "function") logDebugger("Manipulate data before saving", isDebuggerActivated);
                  setData(typeof manipulate === "function" ? manipulate(_result) : _result);
                  logDebugger("Request done", isDebuggerActivated);
                  cache.current[url] = typeof manipulate === "function" ? manipulate(_result) : _result;
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
      updateData: setData,
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
  exports.useQuery = useQuery;
  exports.useQueryContext = useQueryContext;

}));
//# sourceMappingURL=index.umd.js.map
