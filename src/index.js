const positions = new Float32Array([
  -1.0,
  -1.0,
  1.0,
  -1.0,
  -1.0,
  1.0,
  -1.0,
  1.0,
  1.0,
  -1.0,
  1.0,
  1.0
]);

const texcoords = new Float32Array([
  0.0,
  0.0,
  1.0,
  0.0,
  0.0,
  1.0,
  0.0,
  1.0,
  1.0,
  0.0,
  1.0,
  1.0
]);

function attachArrayBuffer(gl, program, key, data) {
  const location = gl.getAttribLocation(program, key);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(location);
  gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);
}

export function create(options = {}) {
  const canvas = options.canvas || document.createElement('canvas');
  const [width, height] = options.size || [200, 200];
  const isDynamic = Boolean(options.dynamic);
  const uniforms = options.uniforms || {};

  canvas.setAttribute('height', height);
  canvas.setAttribute('width', width);

  const gl = canvas.getContext('webgl2', {
    antialias: false,
    preserveDrawingBuffer: true
  });

  if (!gl) {
    throw 'A WebGL rendering context could not be initialized.';
  }

  const vertexShader = createShader(
    gl,
    gl.VERTEX_SHADER,
    options.vertexShaderSource
  );

  const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    options.fragmentShaderSource
  );

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program);
    throw `Could not compile WebGL program.\n\n${info}`;
  }

  gl.useProgram(program);

  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  attachArrayBuffer(gl, program, 'a_texcoord', texcoords);
  attachArrayBuffer(gl, program, 'a_position', positions);

  const setUniform = makeSetUniform(gl, program);
  setUniform('resolution', [width, height]);
  Object.keys(uniforms).forEach(key => {
    setUniform(key, uniforms[key]);
  });

  const start = Date.now();

  function render() {
    if (isDynamic) setUniform('time', (Date.now() - start) * 0.001);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    if (isDynamic) {
      window.requestAnimationFrame(render);
    }
  }

  window.requestAnimationFrame(render);

  return { canvas, gl, program, render, setUniform };
}

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader);
    throw `Could not compile WebGL program.\n\n${info}`;
  }

  return shader;
}

function makeSetUniform(gl, program, uniforms = {}) {
  return (basicName, value) => {
    const isArray = Array.isArray(value);
    const method = isArray ? `${value.length}f` : '1f';
    const name = `u_${basicName}`;

    if (!uniforms.hasOwnProperty(name)) {
      uniforms[name] = {};
    }

    const uniform = uniforms[name];
    const change = uniform.value !== value;
    const uniformMethod = `uniform${method}`;
    const location = gl.getUniformLocation(program, name);

    if (
      change ||
      typeof location === 'undefined' ||
      typeof value === 'undefined'
    ) {
      gl[uniformMethod].apply(gl, [location].concat(value));
    }
  };
}
