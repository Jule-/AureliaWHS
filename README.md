# AureliaWHS

Integration test for WHS in an Aurelia.io single page app.

## Introduction

The purpose of this repository is to show and try to fix:
1. GPU memory leaks with SPA view reloading.
2. Bundling issues with `physics-module-ammonext` and `three` cross dependency.

## Installation & run

1. `$ yarn` (or `npm install`)
2. `$ aurelia run --watch`
3. http://localhost:9000/

## Reproduce memory leaks

1. Open http://localhost:9000/
2. Open **Chrome task manager** (`Shift`+`Esc`)
3. Show `GPU Memory` column (`Right Click` menu)
4. Search for the `AureliaWHS - Home` tab and observe `GPU Memory` column
5. In the SPA tab navigate to `WHS View` then to `Home`
and reproduce this many times.

As you should see it seems that the graphical context is never released
and the GPU memory go up until the tab crash.
How could we fix this?

## Try to bundle `physics-module-ammonext`

1. Open `arelia_project/aurelia.json`
2. Add following conf in the `dependencies` array of the `vendor-bundle.js`
right under `whs`
```javascript
{
  "name": "physics-module-ammonext",
  "path": "../node_modules/physics-module-ammonext/build",
  "main": "physics-module",
  "resources": [
    "worker.js"
  ]
}
```
3. `$ aurelia build`

As you should see `physics-module-ammonext` makes reference to `three`
and the bundler can't find it in the dependecies so it tries to search
it in the root directory.
How could we achieve the bundling with right references?
