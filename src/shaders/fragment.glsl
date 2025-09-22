
#define PI 3.14159265359
precision mediump float;
uniform float time;
uniform float bladeHeight;
varying vec2 vUv;
varying float vYPos;
varying vec3 rotatedNormal1;
varying vec3 rotatedNormal2;
varying float vHeightFactor;

mat3 rotateY(float angle) {
    float c = cos(angle);
    float s = sin(angle);
    return mat3(
        c, 0.0, -s,
        0.0, 1.0,  0.0,
        s, 0.0,  c
    );
}

void main() {
  vUv = uv;
  vYPos = position.y;

  // Gradient factor based on height
  vHeightFactor = clamp(position.y / bladeHeight, 0.0, 1.0); // 0 = base, 1 = tip
  vec3 rotatedNormal1 = rotateY(PI * .3) * normal;
  vec3 rotatedNormal2 = rotateY(-PI * .3) * normal;

  // Wind animation
  float windStrength = 0.1;
  float windFrequency = 1.0;
  float frac = position.y / bladeHeight; // 0 at bottom, 1 at top
  float wind = sin(position.y * windFrequency + time + float(gl_InstanceID)) * windStrength * frac;

  vec3 pos = position;
  pos.x += wind;

  // Apply per-instance matrix (required for InstancedMesh)
  vec4 worldPosition = instanceMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * modelViewMatrix * worldPosition;
}