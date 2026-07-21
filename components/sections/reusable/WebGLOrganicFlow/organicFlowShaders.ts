/**
 * WebGL shaders for the organic green flow (dots) effect.
 * Matches the visual output of webgl.html for consistent reuse.
 */

export const VERTEX_SHADER = `
  attribute vec2 a_position;

  uniform float u_time;
  uniform vec2 u_resolution;
  uniform float u_pixelRatio;
  uniform float u_baseSize;
  uniform float u_sizeVariation;

  varying float v_opacity;
  varying float v_depth;

  void main() {
    float u = a_position.x;
    float v = a_position.y;

    float realAspect = u_resolution.x / u_resolution.y;
    float effectiveAspect = max(realAspect, 0.85);

    float x_pos = (u * 3.0) - 1.5;
    float z_pos = (v * 4.0) - 0.5;

    float contour = cos((u - 0.5) * 4.5) * -0.8 + 0.5;
    contour += smoothstep(0.4, 0.0, u) * 1.0;
    contour += smoothstep(0.6, 1.0, u) * 0.8;

    float t = u_time * 0.1;
    float wave1 = sin(x_pos * 2.2 + z_pos * 1.2 + t) * 0.3;
    float wave2 = sin(x_pos * 6.0 - z_pos * 4.0 + t * 1.5) * 0.08;

    float y_pos = -0.8;
    y_pos += contour * 0.8;
    y_pos += wave1 + wave2;

    vec3 pos = vec3(x_pos * effectiveAspect, y_pos, -z_pos);

    float cameraDist = 2.4;
    float z_translated = pos.z - 1.6;
    float perspective = cameraDist / (cameraDist - z_translated);

    /* Vertical offset to center the wave in the viewport */
    float y_center_offset = 0.5;
    float px = pos.x * perspective;
    float py = (pos.y + y_center_offset) * perspective;

    /* Rotate -45° so the wave runs diagonal (top-left to bottom-right) instead of horizontal */
    float cos45 = 0.707106781;
    float sin45 = -0.707106781;
    float rx = px * cos45 - py * sin45;
    float ry = px * sin45 + py * cos45;
    /* Slight scale so diagonal band still fills viewport */
    float diagScale = 1.15;
    gl_Position = vec4(rx * diagScale, ry * diagScale, 0.0, 1.0);
    gl_PointSize = (u_baseSize + contour * u_sizeVariation) * u_pixelRatio * perspective;

    v_opacity = smoothstep(3.5, 0.5, z_pos);
    v_depth = z_translated;
  }
`;

/* #2E6734 in 0-1: 46/255, 103/255, 52/255 */
export const FRAGMENT_SHADER = `
  precision mediump float;
  varying float v_opacity;
  varying float v_depth;

  const vec3 u_green = vec3(0.180, 0.404, 0.204);

  void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    if (dist > 0.45) discard;

    float alpha = 1.0 - smoothstep(0.35, 0.45, dist);

    float d = smoothstep(-4.5, -1.0, v_depth);
    float d_gradual = pow(d, 0.2);
    float opacity = alpha * v_opacity * (0.12 * d_gradual);
    gl_FragColor = vec4(u_green, opacity);
  }
`;
