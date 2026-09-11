/**
 * L3 - the ambient backdrop's shader pair.
 *
 * A soft, large-scale gradient wash: two low-frequency noise octaves drifting
 * slowly, nudging the ground colour toward the ridge tone in big gentle blooms,
 * finished with a vignette and fine film grain. Atmosphere, not texture - it
 * warms faintly under scroll velocity but never resolves into its own shape.
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

  // Two low-frequency octaves only: large, soft blooms - atmosphere, not
  // texture. The whole point of the redesign is that features stay big enough
  // that the eye never resolves them into noise.
  float wash(vec2 p) {
    float v = noise(p);
    v += 0.5 * noise(p * 2.1 + 11.0);
    return v / 1.5; // roughly -1..1
  }

  void main() {
    // Correct for aspect so blooms don't stretch on wide viewports.
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 p = vec2(vUv.x * aspect, vUv.y);

    // Very low spatial frequency + slow drift and a gentle scroll parallax.
    vec2 q = p * 1.15 + vec2(uTime * 0.010, uTime * 0.006 - uScroll * 0.35);

    float lift = wash(q) * 0.5 + 0.5; // 0..1, smooth

    // A soft vertical gradient so the head of the page is a touch lighter than
    // the foot - depth with no hard edge.
    float grad = smoothstep(-0.2, 1.15, vUv.y);

    // The wash only nudges the ground colour a small, intensity-scaled amount;
    // it never becomes its own shape.
    float amount = (grad * 0.5 + lift * 0.5) * 0.4 * uIntensity;
    vec3 col = mix(uGround, uRidge, amount);

    // A whisper of accent that warms the page broadly under motion, rather than
    // pinned to any feature.
    float heat = clamp(abs(uVelocity) * 0.010, 0.0, 0.5);
    col = mix(col, uAccent, lift * heat * 0.18 * uIntensity);

    // Vignette keeps the corners from lifting and frames the content.
    vec2 c = vUv - 0.5;
    float vig = smoothstep(0.25, 0.95, length(c));
    col = mix(col, uGround, vig * 0.30 * uIntensity);

    // Fine animated film grain - carries the "atmosphere" the flat wash lacks,
    // and doubles as dither so near-black gradients don't band on 8-bit.
    float g = fract(sin(dot(vUv * uResolution + uTime, vec2(12.9898, 78.233))) * 43758.5453);
    col += (g - 0.5) * 0.012 * uIntensity;

    gl_FragColor = vec4(col, 1.0);
  }
`;
