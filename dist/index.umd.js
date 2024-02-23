!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports,require("react")):"function"==typeof define&&define.amd?define(["exports","react"],t):t((e||self).reactUseQuery={},e.react)}(this,function(e,t){function r(){return r=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var o in r)Object.prototype.hasOwnProperty.call(r,o)&&(e[o]=r[o])}return e},r.apply(this,arguments)}var o={selector:void 0,manipulate:void 0,method:"GET",headers:void 0,body:void 0,isDebuggerActivated:!1,cacheTimeout:0},n=null,i=function(e,t,r,o){void 0===e&&(e=""),void 0===t&&(t=!1),void 0===r&&(r=!1),void 0===o&&(o=null),r?t&&console.error("[USE_QUERY]: "+e+" - "+(new Date).toLocaleTimeString(),o):t&&console.log("[USE_QUERY]: "+e+" - "+(new Date).toLocaleTimeString())},a=function(e){var t=Object.keys(o),r=Object.keys(e).filter(function(e){return!t.includes(e)});return void 0!==e.selector&&"string"!=typeof e.selector?(i("Validation error for `options.selector`",isDebuggerActivated,!0,new Error("Selector must be a string. It should contains key value to select from result object.")),!1):void 0===e.method||"string"==typeof e.method&&-1!==["GET","POST","PUT","PATCH","DELETE"].indexOf(e.method.toUpperCase())?void 0!==e.headers&&"object"!=typeof e.headers&&Array.isArray(e.headers)?(i("Validation error for `options.headers`",isDebuggerActivated,!0,new Error("Headers must be an object. It should contains request headers key value.")),!1):void 0!==e.isDebuggerActivated&&"boolean"!=typeof e.isDebuggerActivated&&Array.isArray(e.headers)?(i("Validation error for `options.isDebuggerActivated`",!0,!0,new Error("isDebuggerActivated must be a boolean. It should be activated if you need to debug all process.")),!1):void 0!==e.manipulate&&"function"!=typeof e.manipulate?(i("Validation error for `options.manipulate`",!0,!0,new Error("manipulate must be a function. It rappresent the funcion to manipulate data before saving on state.")),!1):void 0!==e.cacheTimeout&&"number"!=typeof e.cacheTimeout?(i("Validation error for `options.cacheTimeout`",!0,!0,new Error("cacheTimeout must be a number. It rappresent the timeout to remove cached data from memory in milliseconds.")),!1):!(r.length>0&&(i("Validation error",!0,!0,new Error("Found not valid option"+(r.length>1?"s":"")+': "'+r.join('", "')+'".')),1)):(i("Validation error for `options.method`",isDebuggerActivated,!0,new Error('Method must be a string. It should be one of "GET", "POST", "PUT", "PATCH", "DELETE".')),!1)},u=function(e,t){e.cacheTimeout&&e.cacheTimeout>0&&(i("Cache clear timeout start: "+e.cacheTimeout/1e3+" seconds.",e.isDebuggerActivated),clearTimeout(n),n=setTimeout(function(){t.current={},i("Cache cleared",e.isDebuggerActivated)},e.cacheTimeout))},c=t.createContext(null),s=function(){return t.useContext(c)};e.QueryProvider=function(e){var r=e.children,o=t.useState(null);return h(c.Provider,{value:[o[0],o[1]]},r)},e.useQuery=function(e,n){void 0===n&&(n=r({},o));var c=r({},o,n),d=c.selector,l=c.manipulate,f=c.method,h=c.headers,v=c.body,m=c.isDebuggerActivated;a(r({},o,n));var p=t.useRef({}),b=s(),g=b[0],y=b[1],T=t.useState(null),E=T[0],A=T[1],D=t.useState(!1),w=D[0],P=D[1],j=function(){try{if(i("Fetching data...",m),E&&A(null),w||P(!0),p.current[e])return i("Get data from cache, no need a new request",m),"function"==typeof l&&i("Manipulate data before saving",m),y(p.current[e]),u(n,p),P(!1),Promise.resolve();var t=function(e,t){try{var r=e()}catch(e){return t(!0,e)}return r&&r.then?r.then(t.bind(null,!1),t.bind(null,!0)):t(!1,r)}(function(){return function(e,t){try{var r=e()}catch(e){return t(e)}return r&&r.then?r.then(void 0,t):r}(function(){return i("No data found in cache, proceed to do a new request...",m),Promise.resolve(fetch(e,{method:f,headers:h,data:v})).then(function(t){return Promise.resolve(t.json()).then(function(r){if(t.ok){var o=d?r[d]:r;"function"==typeof l&&i("Manipulate data before saving",m),y("function"==typeof l?l(o):o),i("Request done",m),p.current[e]="function"==typeof l?l(o):o,u(n,p),i('New data saved on cache for: "'+e+'"',m)}else A(r),i("An error occurred",m,!0,r)})})},function(e){A(e),i("An error occurred",m,!0,e)})},function(e,t){if(P(!1),i("Data seatled, process done",m),e)throw t;return t});return Promise.resolve(t&&t.then?t.then(function(){}):void 0)}catch(e){return Promise.reject(e)}};return t.useEffect(function(){j()},[e]),{data:g,error:E,loading:w,updateData:y,refresh:j,cache:{get:function(e){return e?p.current[e]:p.current},has:function(e){return p.current[e]},clear:function(){p.current={},i("Cache cleared",m)}}}},e.useQueryContext=s});
//# sourceMappingURL=index.umd.js.map
