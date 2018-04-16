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

### `create (options = {})`

Instantiates a WebGL context on a canvas, and renders shaders to it.<br />
Options can include:

- `canvas` *(optional)* – An existing canvas element to render into; if not supplied, a new canvas is created instead.
- `fragmentShaderSource` – GLSL shader source string to use as the fragment shader.
- `size` *(optional)* – An array of `[width, height]` to size the canvas to; if not supplied, `[200, 200]` is used.
- `uniforms` *(optional)* – An object to inject as uniforms into the fragment shader, using each key as the uniform name (e.g., `"name"` as `u_name`) and the value encoded based on type(s).
- `vertexShaderSource` – GLSL shader source string to use as the vertex shader.
