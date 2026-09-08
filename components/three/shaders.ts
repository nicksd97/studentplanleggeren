/**
 * GLSL for the landing scene. Plain template strings; no loader needed.
 * Fragment shaders end with three's colorspace chunk so linear colours are
 * encoded to sRGB on output (otherwise the gold renders muddy).
 */

export const shapeVertex = /* glsl */ `
  uniform float uTime;
  uniform float uWobble;
  varying vec3 vNormal;
  varying vec3 vWorldPos;

  void main() {
    vec3 p = position;
    float d = sin(p.y * 3.0 + uTime * 0.8) * cos(p.x * 2.5 + uTime * 0.6) * uWobble;
    p += normal * d;
    vec4 worldPos = modelMatrix * vec4(p, 1.0);
    vWorldPos = worldPos.xyz;
    vNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

export const shapeFragment = /* glsl */ `
  uniform vec3 uColorA;   // gold highlight / rim
  uniform vec3 uColorB;   // bronze mid-tone
  uniform vec3 uColorC;   // deep shadow
  uniform float uTime;
  uniform float uGlow;
  varying vec3 vNormal;
  varying vec3 vWorldPos;

  void main() {
    vec3 n = normalize(vNormal);
    vec3 v = normalize(cameraPosition - vWorldPos);
    float fresnel = pow(1.0 - max(dot(n, v), 0.0), 2.5);

    // Vertical gradient that slowly breathes with time
    float t = clamp(n.y * 0.5 + 0.5 + 0.15 * sin(uTime * 0.4 + vWorldPos.x), 0.0, 1.0);
    vec3 base = mix(uColorC, uColorB, t);

    vec3 lightDir = normalize(vec3(0.6, 0.8, 0.5));
    float diff = max(dot(n, lightDir), 0.0);
    float spec = pow(max(dot(reflect(-lightDir, n), v), 0.0), 24.0);

    vec3 color = base * (0.3 + 0.7 * diff) + uColorA * spec * 0.5;
    color += uColorA * fresnel * uGlow;

    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
  }
`;

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
