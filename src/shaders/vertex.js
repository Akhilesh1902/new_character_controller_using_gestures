const shader = /*glsl*/ `
    #define PI 3.14159265359
    precision mediump float;
    uniform float time;
    uniform float bladeHeight;
    varying vec2 vUv;
    varying float vYPos;
    varying vec3 rotatedNormal1;
    varying vec3 rotatedNormal2;
    varying float vHeightFactor;
    // varying float widthFactor;

    uniform sampler2D uNoiseTexture;  // 2D noise texture
    uniform float uWindScale;          // controls noise spatial scale
    uniform float uWindSpeed;          // speed of wind animation
    uniform float uWindStrength;       // max wind displacement

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
        vec3 pos = position;

        // Gradient factor based on height
        vHeightFactor = clamp(position.y / bladeHeight, 0.0, 1.0); // 0 = base, 1 = tip
        vec3 rotatedNormal1 = rotateY(PI * .3) * normal;
        vec3 rotatedNormal2 = rotateY(-PI * .3) * normal;


        float halfWidth = 0.03;
        float xNorm = pos.x / halfWidth; // normalize X to [-1,1]
        // float widthFactor = 1.0 - vHeightFactor;
        float widthFactor = clamp(1.0 - vHeightFactor, 0.2, 1.0);
        xNorm *= widthFactor;
        float radius = 0.05;
                

        pos.x = sin(xNorm * PI * 0.5) * radius;
        pos.z = cos(xNorm * PI * 0.5) * radius - radius; // shift base

        // Wind animation
        float windFrequency = 1.0;
        float frac = position.y / bladeHeight; // 0 at bottom, 1 at top

        vec4 worldPos4 = instanceMatrix * vec4(position, 1.0);
        vec3 worldPos = worldPos4.xyz;
        // Compute UV for noise sampling based on blade position
        // vec2 noiseUV = vec2(position.x * uWindScale, position.z * uWindScale) + vec2(time * uWindSpeed, 0.0);
        // vec2 noiseUV = vec2(worldPos.x * uWindScale, worldPos.z * uWindScale) + vec2(time * uWindSpeed, 0.0);

        // Animate noise UV along this direction
        // vec2 noiseUV = vec2(worldPos.x * uWindScale, worldPos.z * uWindScale) + windDirection * time * uWindSpeed;
        vec2 baseUV = vec2(worldPos.x * uWindScale, worldPos.z * uWindScale);
        vec2 windDirection = normalize(vec2(1.0, -1.0));
        float noiseScale = 0.1;
        vec2 noiseUV = (baseUV * noiseScale) + windDirection * time * uWindSpeed;


        float windNoise = texture2D(uNoiseTexture, noiseUV).r;
        float bendFactor = clamp(position.y / bladeHeight, 0.0, 1.0);

        // Final wind displacement
        float wind = (windNoise - 0.5) * 2.0 * uWindStrength * bendFactor;
            // pos.x += wind;
        // Apply per-instance matrix (required for InstancedMesh)
        vec4 worldPosition = instanceMatrix * vec4(pos, 1.0);

        worldPosition.x += wind * vHeightFactor * vHeightFactor;

        gl_Position = projectionMatrix * modelViewMatrix * worldPosition;
    }
`;

export default shader;
