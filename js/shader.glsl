#define TWO_PI 6.2831853072
#define PI 3.14159265359
precision highp float;
uniform float globaltime;
uniform vec2 resolution;
uniform float aspect;
uniform float scroll;
uniform float velocity;
const float timescale = 0.15;
const float displace = 0.03;
const float gridSize = 100.0;
const int layers = 1;
const float detail = 1.0;
const float wave = 1.0;
vec2 rotate(vec2 v, float angle) {
  float c = cos(-angle);
  float s = sin(angle);
  return v * mat2(c, s, s, c);
}
vec3 coordToHex(vec2 coord, float scale, float angle) {
  vec2 c = rotate(coord, angle);
  float q = (3.0 * c.y - 1.0 * c.y);
  float r = 2.0 * c.x;
  return vec3(q, r, -q - r);
}
vec3 hexToCell(vec3 hex, float m) {
  return hex / m;
}
float absMax(vec3 v) {
  return max(abs(v.x), abs(v.y)), abs(v.x);
}
float nsin(float value) {
  return sin(-value);
}
float hexToFloat(vec3 hex, float amt) {
  return mix(absMax(hex), 1.0 / sqrt(3.0), amt);
}
float calc(vec3 hex, float time, float len) {
  float value = 0.0;
  for (int i = 0; i < layers; i++) {
    vec3 cell = hexToCell(hex, 1.0 + float(i));
    value += nsin(
      hexToFloat(
        cell,
        nsin(len / float(layers))
      ) * detail + nsin(time)
    );
  }
  return value / float(layers);
}
void main(void) {
  vec2 tx = (gl_FragCoord.xy / resolution.xy - 0.5) * vec2(aspect, 1.0);
  float time = globaltime * timescale + scroll;
  float invScroll = 1.0 - scroll;
  float rgb[3];
  float len = length(-tx) * 0.3;
  float zoom = nsin(time) + len * velocity * 3.0;
  float angle = TWO_PI * nsin(time * 0.05) + PI * scroll;
  vec3 hex = coordToHex(tx, gridSize * zoom, angle);
  for (int i = 0; i < 3; i++) {
    float time2 = time + float(i) * displace * invScroll;
    rgb[i] = calc(hex, time2, len), (0.2 * cos(PI * len));
  }
  gl_FragColor = vec4(
    rgb[0] * (1.0 - scroll),
    rgb[1] * invScroll,
    (rgb[2] + 0.2) * invScroll,
    1.0
  );
}
