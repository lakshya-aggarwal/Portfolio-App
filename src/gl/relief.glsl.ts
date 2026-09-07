/**
 * L3 - the relief backdrop's shader pair.
 *
 * This is the reference site's `relief-bg` idea: a stone surface whose ridges
 * warp in proportion to how hard you are scrolling. Still when still, molten
 * when you throw the page.
 *
 * Kept as a TS module rather than a .glsl file so it needs no loader and stays
 * type-checked at the call site.
 */

export const reliefVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    // UV is derived from the clip-space position, NOT from the uv attribute.
    // drei's ScreenQuad is a fullscreen triangle with a 2-component position
    // attribute and no uv attribute at all, so reading it here gives (0,0)
    // for every vertex - the entire screen then samples a single point of the
    // noise field and renders as one flat colour.
    vUv = position.xy * 0.5 + 0.5;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

export const reliefFragment = /* glsl */ `
  precision highp float;

  varying vec2 vUv;

  uniform float uTime;
  uniform float uScroll;    // 0..1 down the document
  uniform float uVelocity;  // signed, smoothed, roughly -60..60
  uniform vec2  uResolution;
  uniform vec3  uGround;
  uniform vec3  uRidge;
  uniform vec3  uAccent;
  uniform float uIntensity;

  // -- gradient noise ------------------------------------------------------
  vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(dot(hash(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
          dot(hash(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
      mix(dot(hash(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
          dot(hash(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
      u.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p = p * 2.03 + 17.3;
      a *= 0.5;
    }
    return v;
  }

  // Height field: domain-warped fbm. The warp amount is what the scroll
  // velocity drives, so fast scrolling shears the ridges.
  float height(vec2 p, float shear) {
    vec2 warp = vec2(fbm(p + vec2(0.0, uTime * 0.015)),
                     fbm(p + vec2(5.2, -uTime * 0.011)));
    return fbm(p + warp * (0.42 + shear));
  }

  void main() {
    // Correct for aspect so ridges don't stretch on wide viewports.
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 p = vec2(vUv.x * aspect, vUv.y) * 2.6;

    // Parallax: the field drifts slower than the page.
    p.y -= uScroll * 1.35;

    float shear = clamp(abs(uVelocity) * 0.016, 0.0, 0.7);
    float h = height(p, shear);

    // Cheap surface normal from two extra taps, for a raking side light.
    float e = 0.0055;
    float hx = height(p + vec2(e, 0.0), shear);
    float hy = height(p + vec2(0.0, e), shear);
    vec3 n = normalize(vec3(h - hx, h - hy, e * 1.7));

    vec3 lightDir = normalize(vec3(-0.55, 0.72, 0.42));
    float lambert = max(dot(n, lightDir), 0.0);
    float spec = pow(lambert, 9.0) * 0.35;

    // Ridge mask: emphasise the creases rather than the flats.
    float ridge = smoothstep(0.03, 0.42, abs(h));

    vec3 col = uGround;
    // Ridges carry the whole effect, so they get most of the contrast budget.
    col = mix(col, uRidge, ridge * (0.55 + lambert * 0.85) * uIntensity);
    col += spec * uIntensity * 1.4;

    // A whisper of the signal colour in the deepest creases, and a little more
    // of it the faster you scroll - the page warms up under motion.
    float heat = clamp(abs(uVelocity) * 0.012, 0.0, 0.55);
    col = mix(col, uAccent, ridge * heat * 0.32 * uIntensity);

    // Vignette keeps the centre calmer behind running text without erasing the
    // relief there - at 0.55 it flattened the whole visible field to ground.
    vec2 c = vUv - 0.5;
    float vig = smoothstep(0.10, 0.85, length(c));
    col = mix(col, uGround, (1.0 - vig) * 0.34);

    // Dither: 8-bit gradients on a near-black field band badly otherwise.
    float dither = (fract(sin(dot(vUv * uResolution, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) / 255.0;
    col += dither;

    gl_FragColor = vec4(col, 1.0);
  }
`;
