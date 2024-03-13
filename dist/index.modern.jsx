import { useState, useContext, useRef, useEffect, createContext } from 'react';
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
    logDebugger("Validation error for `options.selector`", isDebuggerActivated, true, new Error("Selector must be a string. It should contains key value to select from result object."));
    return false;
  } else if (options.name !== undefined && typeof options.name !== "string") {
    logDebugger("Validation error for `options.name`", isDebuggerActivated, true, new Error("Name must be a string. It should contains data name to retrieve it from state."));
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
    clearTimeout(cacheTimeout);
    cacheTimeout = setTimeout(() => {
      cache.current = {};
      logDebugger(`Cache cleared`, options.isDebuggerActivated);
    }, options.cacheTimeout);
  }
};
const QueryContext = /*#__PURE__*/createContext(null);
const QueryProvider = ({
  children
}) => {
  const [state, setState] = useState(null);
  return /*#__PURE__*/jsx(QueryContext.Provider, {
    value: [state, setState],
    children: children
  });
};
const useQueryContext = (name = undefined) => {
  const [data, setData] = useContext(QueryContext);
  if (name) {
    return [data[name], value => setData(prev => _extends({}, prev, {
      [name]: value
    }))];
  } else {
    return [data, setData];
  }
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
  const cache = useRef({});
  const [data, setData] = useQueryContext(name);
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

export { QueryProvider, useQuery, useQueryContext };
//# sourceMappingURL=index.modern.jsx.map
