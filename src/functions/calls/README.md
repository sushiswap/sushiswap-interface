# Optimized MultiCall

> Use the first fit bin packing algorithm for fewer http requests

## Overview

TODO

### Call

| name        | type     | optional | default | description |
| ----------- | -------- | -------- | ------- | ----------- |
| address     | `string` | `false`  | `n/a`   |             |
| callData    | `string` | `false`  | `n/a`   |             |
| gasRequired | `number` | `true`   | `n/a`   |             |

### CallState

| name    | type              | optional | default | description |
| ------- | ----------------- | -------- | ------- | ----------- |
| valid   | `boolean`         | `false`  | `n/a`   |             |
| result  | `CallStateResult` | `false`  | `n/a`   |             |
| loading | `boolean`         | `false`  | `n/a`   |             |
| syncing | `boolean`         | `false`  | `n/a`   |             |
| error   | `boolean`         | `false`  | `n/a`   |             |

### Bin<T>

| name               | type     | optional | default | description |
| ------------------ | -------- | -------- | ------- | ----------- |
| calls              | `T[]`    | `false`  | `n/a`   |             |
| cumulativeGasLimit | `number` | `false`  | `n/a`   |             |
