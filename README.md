# React Use Query

[![npm version](https://badge.fury.io/js/@aredant%2Fuse-query-manager.svg)](https://badge.fury.io/js/@aredant%2Fuse-query-manager) [![GitHub license](https://img.shields.io/github/license/Naereen/StrapDown.js.svg)](https://github.com/alexdant91/react-use-query/tree/master/LICENSE) [![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/alexdant91/async-storage-adapter/graphs/commit-activity)

New version of react use query library. Check on [npm](https://www.npmjs.com/package/@aredant/use-query-manager) and [github](https://github.com/alexdant91/react-use-query).

## 🎉 Version 1.2.x is live 🎉

Check out for changes in the CHANGELOG:

[Changelog](https://github.com/alexdant91/react-use-query/blob/master/CHANGELOG.md)

## Supporting the project

Maintaining a project takes time. To help allocate time, you can Buy Me a Coffee 😉

<a href="https://www.buymeacoffee.com/alexdant91" target="_blank">
  <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" >
</a>
<!-- [![Buy Me A Coffee](https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png)](https://www.buymeacoffee.com/alexdant91){:target="_blank"} -->

## What is React Use Query?

Package to manage all types of queries, using `useQuery(url<String>, options<QueryOptions>)` hook, with cache control system and granular access to context state. It can be used to optimize all request process. 

It is fast and don't make useless request thanks to cache control system. It can also give you access to context state everywhere in your app thanks to `useQueryContext(name)` hook and `<QueryProvider>`.

If you need to trigger request just after an event like button `click`, in an efficient way, you should use `useQueryEvent(url<String>, options<QueryOptions>)` hook instead ([example here](#request-on-event)).

## Contents

1. [Install](#install)
2. [Get Started](#get-started)
3. [Options](#options)
4. [Returns](#returns)
5. [Usage Examples](#usage-examples)
    - 5.1. [Basic](#basic)
    - 5.2. [Pagination](#pagination)
    - 5.3. [Request on event](#request-on-event)

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

Following the list of all avaiable options of `useQuery` hook:

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

Following the list of all avaiable options of `useQueryEvent` hook:

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

| Name      | Type                          | Description                                                                              |
|-----------|:------------------------------|:-----------------------------------------------------------------------------------------|
| data      | `Any`                         | Data returned from request                                                               |
| error     | `Error` or `null`             | Request error.                                                                           |
| loading   | `Boolean`                     | Request loading state.                                                                   |
| mutate    | `Function(data<ReactState>)`  | Mutate function to manipulate `data` state, available everywhere inside `QueryProvider`. |
| refresh   | `Function`                    | Data refresh function.                                                                   |
| cache     | `Object`                      | Cache control function: `get(url<String>)`, `has(url<String>)`, `clear()`                |

`useQueryEvent` hook return an object with following keys:

| Name        | Type                          | Description                                                                              |
|-------------|:------------------------------|:-----------------------------------------------------------------------------------------|
| sendRequest | `Function`                    | Trigger function to send request                                                         |
| isSending   | `Boolean`                     | State of sending status                                                                  |
| data        | `Any`                         | Data returned from request                                                               |
| error       | `Error` or `null`             | Request error.                                                                           |
| loading     | `Boolean`                     | Request loading state.                                                                   |
| mutate      | `Function(data<ReactState>)`  | Mutate function to manipulate `data` state, available everywhere inside `QueryProvider`. |
| refresh     | `Function`                    | Data refresh function.                                                                   |
| cache       | `Object`                      | Cache control function: `get(url<String>)`, `has(url<String>)`, `clear()`                |

## Usage Examples

Following usage example:

### Basic

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

### Pagination

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
import { useState, useEffect } from 'react'
import { useQuery } from '@aredant/use-query-manager'

const API_URL = "https://dummyjson.com/products";

const _formatSkip = (limit, page) => {
  return limit * (page - 1);
}

const App = () => {
  const [page, setLimit] = useState(1);
  const [limit, setPage] = useState(10);
  const [url, setUrl] = useState(`${API_URL}?limit=${limit}&skip=${_formatSkip(limit, page)}`);

  const { data: products, error, loading, mutate, refresh, cache } = useQuery(url, {
    name: "products", // State name to select right context
    selector: "products", // Selector for first level request data
    method: "GET", // Request method
    headers: {}, // Request headers
    body: undefined, // Request body
    transform: (data) => { // Transform response data
      return data.filter((item) => item.id % 2 === 0);
    },
    // pick: (key, value) => { // Pick a portion of data
    //   if (typeof value === "string" || key === "images") return undefined;
    //   return value;
    // },
    pick: ["id", "title", "description"], // Pick a portion of data using array of key name
    cacheTimeout: 5000, // Timeout to auto-clear cache, 0 if you don't want to auto-clear cache
    isDebuggerActivated: true, // -> Take a look to the inspector console 
  });

  const handlePrevPage = () => {
    if (page > 1) setPage((page) => page - 1);
  }
  
  const handleNextPage = () => {
    if (page < Math.ceil(products.length / limit)) setPage((page) => page + 1);
  }

  useEffect(() => {
    setUrl(`${API_URL}?limit=${limit}&skip=${_formatSkip(limit, page)}`);
  }, [page, limit]);

  return (
    <>
      <div>
        <button onClick={handlePrevPage}>Prev</button>
        <span>{page}</span>
        <button onClick={handleNextPage}>Next</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {
            products && products.map(({ id, title, description }) => (
              <tr key={id}>
                <td>{id}</td>
                <td>{title}</td>
                <td>{description}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </>
  )
}

export default App
```

### Request on event

If you want to trigger the request on event like `click` you can use `useQueryEvent` hook. Check the following example:

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
import { useEffect, useState } from 'react';
import { useQueryContext, useQueryEvent } from './hooks';

import "./App.css";

const App = () => {
  const [id, setId] = useState(1);
  const [url, setUrl] = useState(`https://dummyjson.com/products/${id}`);

  const { sendRequest, isSending, data, error, loading, refresh } = useQueryEvent(url, {
    name: "product",
    isDebuggerActivated: true
  });

  useEffect(() => {
    setUrl(`https://dummyjson.com/products/${id}`);
  }, [id])

  return (
    <>
      <div>
        <input type="text" value={id} onInput={({ target }) => setId(target.value)} />
        <button onClick={sendRequest} disabled={isSending}>Send Request</button>
      </div>
      <div>
        {
          loading ? (
            <p>Loading...</p>
          )
          :
          error ? (
            <p>{error.message}</p>
          )
          :
          (
            <pre>
              {
                data && JSON.stringify(data, null, 2)
              }
            </pre>
          )
        }
      </div>
    </>
  )
}

export default App
```

Of course you can use a combination of `useQuery` and `useQueryEvent` inside the same component.
