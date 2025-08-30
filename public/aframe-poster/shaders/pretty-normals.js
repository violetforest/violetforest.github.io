AFRAME.registerShader('pretty-normals', {
  schema: {
    timeMsec: {type:'time', is:'uniform'},
    aPosition: {type:'vec3', is:'attribute'},
    aNormal: {type:'vec3', is:'attribute'}
  },
  vertexShader: `
   attribute vec3 aPosition;
   attribute vec3 aNormal;

   uniform float tVal;
   uniform vec3 waveOrigins[3];
   varying vec4 vNormal;
   varying vec2 vUv;

   vec3 waveLocation(vec3 loc) {
       loc.y = 0.0;
       float yoff = 9.0 * (
           sin(0.1 * (length(waveOrigins[0] - loc) + tVal))
           + sin(0.4 * (length(waveOrigins[1] - loc) + tVal))
           + sin(0.075 * (length(waveOrigins[2] - loc) + tVal * 2.0))
       );
       loc.y = yoff;
       return loc;
   }

   void main() {
       vec3 newLocation = waveLocation(aPosition);
       gl_Position = projectionMatrix * modelViewMatrix * vec4(waveLocation(aPosition), 1.0);
       vNormal = normalize(modelViewMatrix * vec4(cross(
           (waveLocation(aPosition - vec3(0, 0, 0.01)) - newLocation),
           (waveLocation(aPosition - vec3(0.01, 0, 0)) - newLocation)
       ), 0.0));
   }
`,
  fragmentShader: `

    uniform vec3 reverseLightDirection;
    varying vec4 vNormal;

    void main() {
        float light = dot(vNormal, vec4(normalize(reverseLightDirection), 0));
//                gl_FragColor = light * vec4(1, 1, 0, 1);
        gl_FragColor = vec4(vNormal.xyz, 1.0);
    }
`
});
