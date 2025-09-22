const fragmentShader = /*glsl*/ `
    precision mediump float;

    uniform sampler2D map;
    uniform sampler2D alphaMap;
    uniform vec3 tipColor;
    uniform vec3 bottomColor;

    varying vec2 vUv;
    varying float vYPos;
    varying float vHeightFactor;
    varying vec3 rotatedNormal1;
    varying vec3 rotatedNormal2;

    void main() {
        vec4 color = texture2D(map, vUv);
        float alpha = texture2D(alphaMap, vUv).r;

        // Gradient along blade height
        vec3 bladeColor = mix(bottomColor, tipColor, vHeightFactor);

        // Slight green tint
        vec3 greenTint = vec3(0.1, 0.4, 0.1); 
        vec3 finalColor = mix(bladeColor * color.rgb, greenTint, 0.2);

        // Optional: normal (for lighting later)
        // vec3 normal = normalize(mix(rotatedNormal1, rotatedNormal2, 0.5));

        gl_FragColor = vec4(finalColor, alpha * color.a);

        // Discard transparent fragments
        if (gl_FragColor.a < 0.1) discard;
    }

`;

export default fragmentShader;
