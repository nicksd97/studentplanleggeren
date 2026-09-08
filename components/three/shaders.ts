/**
 * GLSL for the particle dust. Plain template strings; no loader needed.
 * The fragment shader ends with three's colorspace chunk so linear colours are
 * encoded to sRGB on output.
 */

export const particleVertex = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  attribute float aSize;
  attribute float aSeed;
  varying float vAlpha;

  void main() {
    vec3 p = position;
    p.y += sin(uTime * 0.3 + aSeed * 6.2832) * 0.15;
    p.x += cos(uTime * 0.2 + aSeed * 3.1416) * 0.1;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    vAlpha = 0.55 + 0.45 * sin(uTime * (0.8 + aSeed * 1.6) + aSeed * 10.0);
    gl_PointSize = uSize * aSize * uPixelRatio * (10.0 / -mv.z);
  }
`;

export const particleFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.08, d) * vAlpha * uOpacity;
    if (a < 0.01) discard;
    gl_FragColor = vec4(uColor, a);
    #include <colorspace_fragment>
  }
`;
