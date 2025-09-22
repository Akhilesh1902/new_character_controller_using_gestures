import * as THREE from "three";
import alphamap from "./resources/blade_alpha.jpg";
import defusemap from "./resources/blade_diffuse.jpg";
import noise from "./resources/noise2.png";
import vs from "./shaders/vertex.js";
import fs from "./shaders/fragment.js";
export default function Grass(plane, scene) {
  // Load textures
  const bladeAlphaURL = "./resources/blade_alpha.jpg";
  const bladeDiffuseURL = "./resources/blade_diffuse.jpg";
  // const noise = "./resources/noise.png";
  const vertexShader = vs;

  // console.log({ vertexShader });
  const loader = new THREE.TextureLoader();
  const alphaMap = loader.load(bladeAlphaURL);
  const diffuseMap = loader.load(bladeDiffuseURL);
  const noiseTexture = new THREE.TextureLoader().load(noise);
  noiseTexture.wrapS = noiseTexture.wrapT = THREE.RepeatWrapping;
  // console.log({ plane });
  // Create a geometry for the grass blades
  const bladeWidth = 0.06;
  const bladeHeight = 0.3;
  const geometry = new THREE.PlaneGeometry(bladeWidth, bladeHeight, 8, 16);
  geometry.translate(0, bladeHeight / 2, 0);
  // Instanced mesh setup
  const instanceCount = 50000 * 2;
  const instancedMesh = new THREE.InstancedMesh(geometry, null, instanceCount);

  // Dummy for transforms
  const dummy = new THREE.Object3D();
  const pw = 40;
  for (let i = 0; i < instanceCount; i++) {
    dummy.position.set(
      Math.random() * pw - pw / 2,
      0.0,
      Math.random() * pw - pw / 2
    );
    dummy.rotation.y = Math.random() * Math.PI * 2;
    // dummy.scale.setScalar(0.5 + Math.random() * 0.5);
    dummy.updateMatrix();
    instancedMesh.setMatrixAt(i, dummy.matrix);
  }

  const grassShaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
      bladeHeight: { value: bladeHeight },
      map: { value: diffuseMap },
      // uDiffuseMap: { value: diffuseMap },
      alphaMap: { value: alphaMap },
      uNoiseTexture: { value: noiseTexture },
      uWindScale: { value: 0.3 }, // 0.3 → 1.0
      uWindSpeed: { value: 0.2 }, // 0.1 → 1.0
      uWindStrength: { value: 0.15 }, // 0.1 → 0.3
      time: { value: 0 },
      tipColor: {
        value: new THREE.Color("0xb3bf0b").convertSRGBToLinear(), // yellowish-green tip
      },
      bottomColor: {
        value: new THREE.Color(0x117a04).convertSRGBToLinear(), // dark green base
      },
      // uDiffuseMap: new THREE.TextureLoader().load(defusemap),
      // uNoiseTexture: new THREE.TextureLoader().load(noise),
    },
    vertexShader: vertexShader,
    fragmentShader: fs,
    side: THREE.DoubleSide,
    transparent: true,
    // wireframe: true,
  });

  // Attach material and add to scene
  instancedMesh.material = grassShaderMaterial;
  // scene.add(instancedMesh);

  scene.add(instancedMesh);
  return { grassShaderMaterial };
}
