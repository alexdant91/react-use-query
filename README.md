# React Use Query

[![npm version](https://badge.fury.io/js/@aredant%2Fuse-query-manager.svg)](https://badge.fury.io/js/@aredant%2Fuse-query-manager) [![GitHub license](https://img.shields.io/github/license/Naereen/StrapDown.js.svg)](https://github.com/alexdant91/react-use-query/tree/master/LICENSE) [![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/alexdant91/async-storage-adapter/graphs/commit-activity)

New version of react use query library. Check on [npm](https://www.npmjs.com/package/@aredant/use-query-manager) and [github](https://github.com/alexdant91/react-use-query).

## 🎉 Version 1.0.x is live 🎉

Check out for changes in the CHANGELOG:

[Changelog](https://github.com/alexdant91/async-storage-adapter/blob/master/CHANGELOG.md)

## Supporting the project

Maintaining a project takes time. To help allocate time, you can Buy Me a Coffee 😉

<a href="https://www.buymeacoffee.com/alexdant91" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>
<!-- [![Buy Me A Coffee](https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png)](https://www.buymeacoffee.com/alexdant91){:target="_blank"} -->

## Contents

Cooming soon full documentation.

<!--
1. [Install](#how-to-install);
2. [Get Started](#get-started);
3. [Functions](#functions);
4. [Examples](#examples);

## Install

Inside your project run on terminal:

```cmd
npm install async-storage-adapter --save
```

or

```cmd
yarn add async-storage-adapter
```

Then link the package on React Native 0.60+:

```cmd
npx pod-install
```

Instead on React Native <= 0.59:

```cmd
react-native link @react-native-async-storage/async-storage
```

The only one dependency that will be installed is `@react-native-async-storage/async-storage`.

## Get Started

Import the package on your project file. First of all you need to declare a global key name to store your data.

```js
/**
 * Class constructor accept one single required parameter, the `GlobalKeyName`.
 */

// CommonJS Module
const AsyncStorageAdapter = require("async-storage-adapter");

const { getData } = new AsyncStorageAdapter("@MyAppName");

// ES6 Module
import AsyncStorageAdapter from "async-storage-adapter";

const { getData } = new AsyncStorageAdapter("@MyAppName");
```

## Functions

Following the list of all avaiable functions. All functions return a `<Promise>` so need to be called inside `async/await` block:

| Name               | Parameters                     | Description                                                                     |       Return       |
|--------------------|:-------------------------------|:--------------------------------------------------------------------------------|:------------------:|
| clearAll           | --                             | Clear all data from async storage.                                              | `success<Boolean>` |
| getAllData         | --                             | Get all data from async storage.                                                |   `data<Object>`   |
| getAllKeys         | --                             | Get array of all keys from async storage.                                       |   `keys<Array>`    |
| getData            | `key<String>`                  | Get single key data from async storage.                                         |    `data<Any>`     |
| getMultipleData    | `key<Array<String>>`           | Get multiple keys data from async storage.                                      |   `data<Object>`   |
| removeData         | `key<String>`                  | Remove single key data from async storage.                                      | `success<Boolean>` |
| removeMultipleData | `key<Array<String>>`           | Remove multiple keys data from async storage.                                   | `success<Boolean>` |
| storeData          | `key<String>`, `value<Object>` | Store single `{ key: value }` object.                                           | `success<Boolean>` |
| storeMultipleData  | `datas<Object<Any>>`           | Take an object with multiple `{ key: value }` pairing to save in async storage. | `success<Boolean>` |

## Examples Usage

Following an example with all functions using `ES6 Module` syntax:

```js
import AsyncStorageAdapter from "async-storage-adapter";

// Declare functions from `AsyncStorageAdapter`;
// Using `@MyAppName` as GlobalKeyName parameter.
const {
  clearAll,
  getAllData,
  getAllKeys,
  getData,
  getMultipleData,
  removeData,
  removeMultipleData,
  storeData,
  storeMultipleData
} = new AsyncStorageAdapter("@MyAppName");

/**
 * !IMPORTANT All functions return a `<Promise>` so need to be called inside `async/await` block
 */

// Clear all data in AsyncStorage
(async () => {
  try {
    // No need to pass parameters
    const isClear = await clearAll(); // Return Boolean value
  } catch (err) {
    throw err;
  }
})();

// Retrieve all data in AsyncStorage
(async () => {
  try {
    // No need to pass parameters
    const keys = await getAllData(); // Object with all data stored
  } catch (err) {
    throw err;
  }
})();

// Retrieve all keys in AsyncStorage
(async () => {
  try {
    // No need to pass parameters
    const datas = await getAllKeys(); // Array with all keys stored
  } catch (err) {
    throw err;
  }
})();

// Retrieve single key data in AsyncStorage
(async () => {
  try {
    // Pass `key` name as string
    const data = await getData("MY_KEY_NAME"); // Any data stored with specified key
  } catch (err) {
    throw err;
  }
})();

// Retrieve multiple keys data in AsyncStorage
(async () => {
  try {
    // Pass `keys` array with names as strings
    const datas = await getMultipleData(["MY_KEY_NAME_1", "MY_KEY_NAME_2", "..."]); // Any data stored with specified keys
  } catch (err) {
    throw err;
  }
})();

// Delete single key data in AsyncStorage
(async () => {
  try {
    // Pass `key` name as string
    const isDeleted = await removeData("MY_KEY_NAME"); // Return Boolean value
  } catch (err) {
    throw err;
  }
})();

// Delete multiple keys data in AsyncStorage
(async () => {
  try {
    // Pass `keys` array with names as strings
    const isDeleted = await removeMultipleData(["MY_KEY_NAME_1", "MY_KEY_NAME_2", "..."]); // Return Boolean value
  } catch (err) {
    throw err;
  }
})();

// Store single key data in AsyncStorage
(async () => {
  try {
    // Pass `key` name as string
    // Pass `value` as `<Any>` type, e.g. an `<Object>` like `{ key: value }`
    const isStored = await storeData("MY_KEY_NAME", { key: value }); // Return Boolean value
  } catch (err) {
    throw err;
  }
})();

// Store multiple keys data in AsyncStorage
(async () => {
  try {
    // Pass `object` value like `{ key: value }`. `key` will be the saved `key` name and `value` the saved `value`
    const isStored = await storeMultipleData({ key: value }); // Return Boolean value
  } catch (err) {
    throw err;
  }
})();
```
-->