# WebGL Sketch

[![npm](https://img.shields.io/npm/v/webgl-sketch.svg)](https://www.npmjs.org/package/webgl-sketch)


## Example

```js
import * as Sketch from 'webgl-sketch';

Sketch.create({
  canvas: document.getElementById('Output'),
  fragmentShaderSource: require('my-fragment.glsl'),
  size: [window.innerWidth, window.innerHeight],
  uniforms: {
    baseColor: [0.424, 0.357, 0.482],
    seed: 42.0
  },
  vertexShaderSource: require('basic-vertex.glsl')
});
```


## API

*(Coming soon)*
