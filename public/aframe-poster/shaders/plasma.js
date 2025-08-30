AFRAME.registerShader('plasma', {
  schema: {
    timeMsec: {type:'time', is:'uniform'},
    resolution: {type: 'vec2', is: 'uniform', default: {x:50, y:50}},
    aVertexPosition: {type: 'vec3', is: 'attribute'},
    displacement: {type: 'float', is: 'attribute'},
    amplitude: {type: 'float', default: 10}
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    attribute float displacement;
    uniform float amplitude;

    void main() {
      vUv = uv;
      vNormal = normal;
      vec3 newPosition = position + normal * vec3(displacement * amplitude);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0 );
    }
`,
  fragmentShader: `
    precision mediump float;
    uniform highp float timeMsec;
    uniform vec2 resolution;
    varying vec2 vUv;
    varying vec3 vNormal;

		void main() {
      float scale = 0.005;
      float time = timeMsec / 5.0;
      float r1 = 0.24 ;
      float r2 = 3.49 ;
      float r3 = 4.2449;
      float x = gl_FragCoord.x;
      float y = gl_FragCoord.y;
      float h = resolution.y;
      float w = resolution.x;

      vec3 light = vec3(0.5, 2.0, 1.0);
      light = normalize(light);

      float dot = dot(vNormal, light);
      float dotProduct = max(0.1, dot);

      float col =
    sin(distance( vec2(r1 + time, r1 * y + time), vec2(w * r1 * r2, h * r2) ) * scale);

    vec3 color = vec3( dotProduct + 0.11 * sin(col), sin(col) - dotProduct, cos(col)) + 0.301;
    color -= mod(gl_FragCoord.x, 1.0) > 1.0 ? 0.4 : 0.2;

    gl_FragColor = vec4(color, 1.0);
  }
`
});
