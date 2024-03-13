# React Use Query

[![npm version](https://badge.fury.io/js/@aredant%2Fuse-query-manager.svg)](https://badge.fury.io/js/@aredant%2Fuse-query-manager) [![GitHub license](https://img.shields.io/github/license/Naereen/StrapDown.js.svg)](https://github.com/alexdant91/react-use-query/tree/master/LICENSE) [![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/alexdant91/async-storage-adapter/graphs/commit-activity)

New version of react use query library. Check on [npm](https://www.npmjs.com/package/@aredant/use-query-manager) and [github](https://github.com/alexdant91/react-use-query).

## 🎉 Version 1.0.x is live 🎉

Check out for changes in the CHANGELOG:

[Changelog](https://github.com/alexdant91/react-use-query/blob/master/CHANGELOG.md)

## Supporting the project

Maintaining a project takes time. To help allocate time, you can Buy Me a Coffee 😉

<a href="https://www.buymeacoffee.com/alexdant91" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>
<!-- [![Buy Me A Coffee](https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png)](https://www.buymeacoffee.com/alexdant91){:target="_blank"} -->

## What is React Use Query?

Package to manage all types of queries, with cache control system and granular access to context state. It can be used to optimize all request process. It is fast and don't make useless request thanks to cache control sustem. It can also give  you access to context state everywhere in your app thanks to `useQueryContext(name)` hook.

## Contents

1. [Install](#install);
2. [Get Started](#get-started);
3. [Options](#options);
4. [Returns](#returns);
5. [Usage Example](#usage-example);

## Install

Inside your project run on terminal:

```cmd
npm i @aredant/use-query-manager
```

or

```cmd
yarn add @aredant/use-query-manager
```

The only one dependency that will be installed is `@aredant/use-query-manager`.

## Get Started

Import the package on your main file and wrap project inside `QueryProvider`.

```js
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

import { QueryProvider } from "@aredant/use-query-manager"

import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryProvider>
    <App />
  </QueryProvider>,
)
```

## Options

Following the list of all avaiable options:

| Name                | Type                           | Description                                                                  |
|---------------------|:-------------------------------|:-----------------------------------------------------------------------------|
| name                | `String`                       | It should contains name string for context state granular control.           |
| selector            | `String`                       | It should contains key value to select from result object.                   |
| pick                | `Function` or `Array<String>`  | It rappresent the function or the array to pick just a portion of data.      |
| transform           | `Function`                     | It rappresent the funcion to transform data before saving on state.          |
| method              | `String`                       | It should be one of "GET", "POST", "PUT", "PATCH", "DELETE".                 |
| headers             | `Object`                       | Headers must be an object. It should contains request headers key value.     |
| body                | `Any`                          | Request body data                                                            |
| isDebuggerActivated | `Boolean`                      | It should be activated if you need to debug all process.                     |
| cacheTimeout        | `Number`                       | It rappresent the timeout to remove cached data from memory in milliseconds. |

## Returns

`useQuery` hook return an object with following keys:

| Name      | Type                           | Description                                                                              |
|-----------|:-------------------------------|:-----------------------------------------------------------------------------------------|
| data      | `Any`                          | Data returned from request                                                               |
| error     | `Function` or `Array<String>`  | Request error.                                                                           |
| loading   | `Function`                     | Request loading state.                                                                   |
| mutate    | `String`                       | Mutate function to manipulate `data` state, available everywhere inside `QueryProvider`. |
| refresh   | `Object`                       | Data refresh function.                                                                   |
| cache     | `Object`                       | Cache control function: `get(url<String>)`, `has(url<String>)`, `clear()`                |

## Usage Example

Following usage example:

main.jsx

```js
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

import { QueryProvider } from "@aredant/use-query-manager"

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryProvider>
    <App />
  </QueryProvider>,
)
```

App.jsx

```js
import { useEffect } from 'react'
import { useQuery } from '@aredant/use-query-manager'

import InnerComponent from './InnerComponent'

const App = () => {
  const { data, error, loading, mutate, refresh, cache } = useQuery("https://dummyjson.com/products", {
    name: "products", // State name to select right context
    selector: "products", // Selector for first level request data
    method: "GET", // Request method
    headers: {}, // Request headers
    body: undefined, // Request body
    transform: (data) => { // Transform response data
      return data.filter((item) => item.id % 2 === 0);
    },
    pick: (key, value) => { // Pick a portion of data
      if (typeof value === "string" || key === "images") return undefined;
      return value;
    },
    cacheTimeout: 5000, // Timeout to auto-clear cache, 0 if you don't want to auto-clear cache
    isDebuggerActivated: true, // -> Take a look to the inspector console 
  });

  useEffect(() => {
    console.log(data, error, loading);
  }, [data, error, loading]);

  return (
    <>
      <pre>
        <InnerComponent />
      </pre>
    </>
  )
}

export default App
```

InnerComponent.js

```js
import {useQueryContext} from '@aredant/use-query-manager'

const InnerComponent = () => {
  const [data, setDate] = useQueryContext(); // Get all available query data
  const [products, setProducts] = useQueryContext("products"); // Get just a portion of data by name

  return (
    <pre>
        {data && JSON.stringify(data, null, 2)}
        {products && JSON.stringify(products, null, 2)}
    </pre>
  )
}

export default InnerComponent;
```
