# Trail

<p align="center">
  <img src="docs/imgs/logo.png" alt="Trail logo" title="Trail logo" width="256">
</p>

> Guide your user, step by step

A simple and lightweight tour library 

## Quick start

Choose your favorite option below:

### Install with NPM

```
npm i @ionited/trail
```

### Get from UNPKG

[https://unpkg.com/@ionited/trail@latest/dist/trail.js](https://unpkg.com/@ionited/trail@latest/dist/trail.js)

---

## Usage

To basic usage you can simply call:

```js
var trail = Trail([{
  id: 1,
  content: 'First step',
  attachedEl: document.getElementById('one')
}, {
  id: 2,
  content: 'Step two, without attachedEl'
}, {
  id: 3,
  content: 'Step 3',
  attachedEl: document.getElementById('two')
}, {
  id: 4,
  content: 'Step 4, end of the line!',
  attachedEl: document.getElementById('three')
}]);
```

### Options

```ts
Trail(steps?: Step[]): TrailCore

export interface Step {
  id: any;
  content: string;
  attachedEl?: HTMLElement | null;
  interactive?: boolean;
}

interface TrailCore {
  steps: Step[];
  next(): void;
  back(): void;
  stop(): void;
  destroy(): void;
}
```

`TrailCore.steps` is just an array, you can use any `Array` functions on this (e.g, `push`, `splice`, `unshift`)

## License

Copyright (c) 2021 Ion. Licensed under [Mit License](LICENSE).
